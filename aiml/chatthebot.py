import google.generativeai as genai
import os
import numpy as np
import PyPDF2
from dotenv import load_dotenv
import faiss

# Constants to replace magic numbers
DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200
DEFAULT_TOP_K = 3
MAX_CONVERSATION_HISTORY = 10
EMBEDDING_DIMENSION = 768
COSINE_EPSILON = 1e-8

load_dotenv() 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file. Please set it.")

genai.configure(api_key=GEMINI_API_KEY)

# Better system prompt
SYSTEM_PROMPT = """You are a helpful AI assistant specializing in turf booking and management.

Your role and responsibilities:
- Help users make turf bookings and reservations
- Answer questions about turf etiquette, rules, and policies
- Provide information about facilities, pricing, and availability
- Guide users through the booking process

Important guidelines:
- Only answer questions related to turf booking and management
- Base your responses solely on the provided context from documents
- If information is not available in the context, clearly state this limitation
- Do not provide medical advice, personal opinions, or general sports advice
- For issues you cannot resolve, direct users to contact the turf owner
- Do not make up information or provide answers based on assumptions

You are focused specifically on turf-related assistance and booking support."""

model = genai.GenerativeModel('models/gemini-2.5-flash-lite')
embedding_model = 'models/embedding-001' 

def load_and_chunk_pdfs(pdf_dir="data", chunk_size=DEFAULT_CHUNK_SIZE, overlap=DEFAULT_CHUNK_OVERLAP):
    """
    Loads text from PDFs in a directory, chunks it, and returns a list of dictionaries.
    Each dictionary contains 'text' and 'source_file'.
    """
    documents = []
    for filename in os.listdir(pdf_dir):
        if filename.endswith(".pdf"):
            filepath = os.path.join(pdf_dir, filename)
            try:
                with open(filepath, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    full_text = ""
                    for page_num in range(len(reader.pages)):
                        page = reader.pages[page_num]
                        full_text += page.extract_text() or ""
                    for i in range(0, len(full_text), chunk_size - overlap):
                        chunk = full_text[i:i + chunk_size]
                        if chunk.strip(): 
                            documents.append({
                                'text': chunk.strip(),
                                'source_file': filename
                            })
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    return documents

# FAISS vector store instead of simple list
vector_store = []
faiss_index = None

def generate_embedding(text):
    """Generates an embedding for a given text."""
    if not text.strip():
        return np.zeros(EMBEDDING_DIMENSION)
    try:
        response = genai.embed_content(
            model=embedding_model,
            content=text,
            task_type="RETRIEVAL_DOCUMENT"
        )
        return np.array(response['embedding'])
    except Exception as e:
        print(f"Error generating embedding for text: '{text[:50]}...' - {e}")
        return np.zeros(EMBEDDING_DIMENSION)

def populate_vector_store(documents):
    """Generates embeddings for all documents and populates the FAISS vector store."""
    global faiss_index
    print("Generating embeddings for documents...")
    
    embeddings_list = []
    for doc in documents:
        embedding = generate_embedding(doc['text'])
        doc['embedding'] = embedding
        embeddings_list.append(embedding)
        vector_store.append(doc)
    
    # Create FAISS index for efficient similarity search
    if embeddings_list:
        embeddings_matrix = np.array(embeddings_list, dtype=np.float32)
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings_matrix)
        
        # Create FAISS index (Inner Product for normalized vectors = cosine similarity)
        faiss_index = faiss.IndexFlatIP(EMBEDDING_DIMENSION)
        faiss_index.add(embeddings_matrix)
    
    print(f"Finished generating embeddings for {len(documents)} chunks.")

def find_most_relevant_chunks(query_embedding, top_k=DEFAULT_TOP_K):
    """Finds the top_k most similar chunks using FAISS for efficient search."""
    if faiss_index is None or len(vector_store) == 0:
        return []
    
    # Normalize query embedding
    query_embedding = query_embedding.reshape(1, -1).astype(np.float32)
    faiss.normalize_L2(query_embedding)
    
    # Limit top_k to available documents
    actual_top_k = min(top_k, len(vector_store))
    
    # Perform FAISS search
    similarities, indices = faiss_index.search(query_embedding, actual_top_k)
    
    # Return corresponding documents
    result_chunks = []
    for idx in indices[0]:
        if 0 <= idx < len(vector_store):
            result_chunks.append(vector_store[idx])
    
    return result_chunks

def generate_response(user_message, conversation_history, retrieved_chunks):
    """
    Generates a response using Gemini, incorporating retrieved context and chat history.
    """
    context_text = "\n\n".join([chunk['text'] for chunk in retrieved_chunks])
    source_files = ", ".join(list(set([chunk['source_file'] for chunk in retrieved_chunks])))

    messages = [
        {"role": "user", "parts": [SYSTEM_PROMPT]},
        {"role": "model", "parts": ["Understood. I will answer based on the provided context."]}
    ]

    for turn in conversation_history:
        messages.append({"role": "user", "parts": [turn['user']]})
        messages.append({"role": "model", "parts": [turn['assistant']]})

    current_query_parts = [
        f"Context from documents (Sources: {source_files if source_files else 'None'}):\n---\n{context_text}\n---\n",
        f"User query: {user_message}"
    ]
    messages.append({"role": "user", "parts": current_query_parts})

    try:
        response = model.generate_content(messages)
        return response.text, source_files
    except Exception as e:
        print(f"Error generating content: {e}")
        return "Sorry, I couldn't generate a response. Please try again.", ""

print("Initializing RAG system...")
pdf_documents = load_and_chunk_pdfs()
if not pdf_documents:
    print("No PDF documents found or processed. Please check the 'data' directory and PDF contents.")
    print("Exiting.")

populate_vector_store(pdf_documents)
print("\n--- RAG Chatbot (Type 'exit' to quit) ---")
conversation_history = []
while True:
    user_input = input("\nUser: ")
    if user_input.lower() == 'exit':
        print("Exiting chatbot. Goodbye!")
        break

    query_embedding = generate_embedding(user_input)
    retrieved_chunks = find_most_relevant_chunks(query_embedding, top_k=DEFAULT_TOP_K)
    assistant_response, sources = generate_response(user_input, conversation_history, retrieved_chunks)

    print(f"Assistant: {assistant_response}")#Chatbot response
    if sources:
        print(f"Sources: {sources}")#source pdf files

    conversation_history.append({'user': user_input, 'assistant': assistant_response})

    if len(conversation_history) > MAX_CONVERSATION_HISTORY:#remove oldest messages to limit history size
        conversation_history.pop(0)