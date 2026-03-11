import chromadb
import ollama

client = chromadb.PersistentClient(path="AI\\ReDocs\\Data")
collection = client.get_collection(name='User01')
data = collection.count()
data = {}
results = collection.get(include=['documents'])

user_input = input(':')
Identity = "Suppose you are a Professional legal advisor"

# for i,document in zip(results("ids")[0],results("documents")[0]):
#     print(f"{i} content:{document}")

# Use square brackets [] instead of parentheses ()
# Access index [0] because results are returned as [[item1, item2]]
for doc_id, text in zip(results["ids"], results["documents"]):
    data[doc_id]=[text]
formated_ans = f'{Identity} {user_input} : {data}'

response = ollama.chat(
    model="deepseek-r1:8b",
    messages=[
        # {'role':'system','content':'Suppose you are a Professional Legal Advisor'},
        {'role':'user','content':formated_ans}],
    stream=True
)
for chunk in response:
  print(chunk['message'][""'content'], end='', flush=True)