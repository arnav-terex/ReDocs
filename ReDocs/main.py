from fastapi import FastAPI,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from docling.document_converter import DocumentConverter  
from docling.chunking import HybridChunker
import ollama
import os
import shutil

app = FastAPI()

# CORS - allows React (port 5173) to talk to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React's port
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to ChromaDB
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "Data")

# client = chromadb.PersistentClient(path=DB_PATH)
# collection = client.get_collection(
#     name="User01",
#     embedding_function=SentenceTransformerEmbeddingFunction(
#         model_name="BAAI/bge-m3"
#     )
# )

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # 1. Save uploaded file with original filename
    PDF_PATH = os.path.join(BASE_DIR, "Data", file.filename)
    with open(PDF_PATH, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Convert with Docling
    converter = DocumentConverter()
    result = converter.convert(PDF_PATH)
    doc = result.document

    # 3. Chunk
    chunker = HybridChunker(
        tokenizer="sentence-transformers/all-MiniLM-L6-v2",
        max_tokens=400,
        merge_peers=True
    )
    chunks = list(chunker.chunk(doc))

    # 4. Store in ChromaDB
    client = chromadb.PersistentClient(path=DB_PATH)
    try:
        client.delete_collection(name="User01")
    except:
        pass

    collection = client.get_or_create_collection(
        name="User01",
        embedding_function=SentenceTransformerEmbeddingFunction(
            model_name="BAAI/bge-m3"
        )
    )
    for i, chunk in enumerate(chunks):
        collection.add(
            ids=f"chunk_{i}",
            documents=chunk.text,
            metadatas={"headings": str(chunk.meta.headings)}
        )

    return { "message": f"'{file.filename}' processed! {len(chunks)} chunks stored." }


# Request body shape
class QuestionRequest(BaseModel):
    question: str

# The endpoint React will call
@app.post("/ask")
async def ask_question(body: QuestionRequest):

    fresh_client = chromadb.PersistentClient(path=DB_PATH)
    fresh_collection = fresh_client.get_collection(
        name="User01",
        embedding_function=SentenceTransformerEmbeddingFunction(
            model_name="BAAI/bge-m3"
        )
    )
    
    # 1. Search ChromaDB for relevant chunks
    results = fresh_collection.query(
        query_texts=[body.question],
        n_results=3
    )
    context = "\n\n".join(results["documents"][0])

    # 2. Send to DeepSeek via Ollama
    response = ollama.chat(
        model="deepseek-r1:8b",
        messages=[{
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {body.question}"
        }]
    )

    # 3. Return answer to React
    return { "answer": response["message"]["content"] }