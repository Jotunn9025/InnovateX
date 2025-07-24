import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
import numpy as np
import joblib
import os

# Load data
df = pd.read_csv("data.csv")

# Features and target
X = df[['day_of_week', 'location', 'sport', 'time_slot']]
y = df['demand']

# Encode categorical features
encoders = {}
for column in X.columns:
    enc = LabelEncoder()
    X[column] = enc.fit_transform(X[column])
    encoders[column] = enc

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Evaluate
predictions = model.predict(X)
mse = mean_squared_error(y, predictions)
print(f"✅ Model trained with Mean Squared Error (MSE): {mse:.2f}")

# Save model and encoders
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/demand_model.pkl")
joblib.dump(encoders, "model/encoders.pkl")
print("✅ Model and encoders saved to /model/")
