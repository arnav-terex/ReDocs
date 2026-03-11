from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
import chromadb
# from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os

load_dotenv()
chroma_key = os.getenv("CHROMA_API")
openai_key = os.getenv("OPENAI_API")

# client = chromadb.PersistentClient(path="Data")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "Data")
client = chromadb.PersistentClient(path=DB_PATH)

# client = chromadb.CloudClient(
#     tenant= '8a6f944f-9642-4370-a235-6cd0ae089030',
#     database='ReDocs',
#     api_key= chroma_key
# )

# 1. Convert the PDF to Docling's internal "Schema"
converter = DocumentConverter()
result = converter.convert("Data\\docum.pdf")
doc = result.document  # This is now a structured object, not just text

# 2. Initialize the Chunker
# We use 'HybridChunker' because it respects headers but manages token limits
chunker = HybridChunker(
    tokenizer="sentence-transformers/all-MiniLM-L6-v2", # Matches embedding model
    max_tokens=512, # Ensuring chunks fit in DeepSeek's sweet spot
    merge_peers=True # Keeps sub-clauses together if they fit
)

# 3. Generate the chunks
chunks = list(chunker.chunk(doc))
print("Listing Done")

# client.delete_collection(name="User01") # in case want to delete the profile at chromadb
try:
    client.delete_collection(name="User01")
except:
    pass

collection = client.get_or_create_collection(name="User01",embedding_function=SentenceTransformerEmbeddingFunction(
    model_name="BAAI/bge-m3"
))

# 4. Inspect a chunk
for i, chunk in enumerate(chunks[:]):#do provide an end point to list else system may crash 
    # Last limit is chunk 46 as we have to pay for chroma db here after
    # Docling attaches the "Heading Path" to the chunk!
    collection.add(

        ids=f'{chunk.meta.headings}',
        documents=f"{chunk.text}"
    )
        # metadatas=[f"Headings:{chunk.meta.headings}"]
    print(f"--- Chunk {i} ---")
    # print(f"Heading Path: {chunk.meta.headings}") 
    # print(f"Content: {chunk.text[:200]}...")
    print("Done--------------")
