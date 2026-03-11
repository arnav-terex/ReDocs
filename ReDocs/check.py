import os
import chromadb

# Path that main.py uses
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "Data")

print(f"Looking in: {DB_PATH}")

client = chromadb.PersistentClient(path=DB_PATH)
collections = client.list_collections()
print(f"Collections found: {collections}")