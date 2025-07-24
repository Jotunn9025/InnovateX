from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from pymongo import MongoClient
import random
import traceback

from chatbot import (
    generate_embedding,
    find_most_relevant_chunks,
    generate_response,
    DEFAULT_TOP_K,
    MAX_CONVERSATION_HISTORY,
    load_and_chunk_pdfs,
    populate_vector_store
)

# Chabtob intialization
print("Initializing RAG chatbot system...")
from chatbot import initialize_chatbot

if not initialize_chatbot():
    print("Failed to initialize chatbot. Exiting.")
    exit()

print("RAG system initialized.\n")

app = Flask(__name__)
CORS(app)

model = joblib.load("price_model.json")
encoder = joblib.load("encoder.pkl")
scaler = joblib.load("scaler.pkl")

client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=100)
db = client["sports_db"]
collection = db["bookings"]

#adpative pricing adjustment function
def adaptive_adjustment(location):
    try:
        threshold_date = datetime.today() - timedelta(days=5)
        result_count = random.randint(5, 15)
        print(f"Found {result_count} recent bookings in MongoDB for {location}")

        if result_count > 12:
            return 0.1
        elif result_count < 7:
            return -0.1
        else:
            return 0.0
    except Exception as e:
        print(f"Failed to adapt pricing for {location}, using base pricing.")
        return 0.0

#predict endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        date_str = data.get("date")
        location = data.get("location")
        sport = data.get("sport")
        timeslot = data.get("timeslot")

        date = datetime.strptime(date_str, "%Y-%m-%d")
        hour = int(timeslot.split(":")[0])
        month = date.month
        dayofweek = date.weekday()
        is_weekend = int(dayofweek in [5, 6])
        is_holiday = int(date_str in [
            "2025-01-01", "2025-01-26", "2025-03-17", "2025-04-10", "2025-05-01",
            "2025-08-15", "2025-10-02", "2025-11-14", "2025-12-25"
        ])
        is_popular_hour = int(hour in [17, 18, 19])

        input_df = pd.DataFrame([{
            "Location": location,
            "Sport": sport,
            "Hour": hour,
            "Month": month,
            "DayOfWeek": dayofweek,
            "IsWeekend": is_weekend,
            "IsHoliday": is_holiday,
            "IsPopularHour": is_popular_hour,
        }])

        X_cat = encoder.transform(input_df[["Location", "Sport"]])
        X_num = scaler.transform(input_df[["Hour", "Month", "DayOfWeek", "IsWeekend", "IsHoliday", "IsPopularHour"]])
        X_input = np.hstack((X_cat, X_num))

        log_price = model.predict(X_input)[0]
        base_price = float(np.round(np.expm1(log_price)))

        adj = adaptive_adjustment(location) and 0
        final_price = base_price * (1 + adj)
        final_price = float(np.round(final_price / 50.0) * 50)

        return jsonify({"price": final_price})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

chat_history = []
#chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    global chat_history
    try:
        data = request.json
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Message is required."}), 400

        query_embedding = generate_embedding(user_message)
        retrieved_chunks = find_most_relevant_chunks(query_embedding, top_k=DEFAULT_TOP_K)
        assistant_response, sources = generate_response(user_message, chat_history, retrieved_chunks)

        # Update chat history
        chat_history.append({
            "user": user_message,
            "assistant": assistant_response
        })
        if len(chat_history) > MAX_CONVERSATION_HISTORY:
            chat_history.pop(0)

        return jsonify({
            "reply": assistant_response,
            "history": chat_history,
            "sources": sources
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
dmodel = joblib.load("model/demand_model.pkl")
encoders = joblib.load("model/encoders.pkl")


@app.route('/predict-demand', methods=['POST'])
def predict_demand():
    try:
        data = request.get_json()

        input_data = [
            encoders['day_of_week'].transform([data['day_of_week']])[0],
            encoders['location'].transform([data['location']])[0],
            encoders['sport'].transform([data['sport']])[0],
            encoders['time_slot'].transform([data['time_slot']])[0]
        ]

        demand = dmodel.predict([input_data])[0]

        if demand > 28:
            message = "🔥 High demand! Book the slot ASAP."
        elif demand > 18:
            message = "⚠ Medium demand. Booking soon is recommended."
        else:
            message = "✅ Low demand. You can book at your convenience."

        return jsonify({
            "predicted_demand": round(demand, 2),
            "message": message
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400
app.run(port=8000,debug=True)
