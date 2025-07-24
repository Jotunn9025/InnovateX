import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import root_mean_squared_error
from datetime import datetime

df = pd.read_csv("sports_booking_data.csv")

df["Date"] = pd.to_datetime(df["Date"])
df["Hour"] = df["TimeSlot"].str.extract(r'(\d+):')[0].astype(int)
df["Month"] = df["Date"].dt.month
df["DayOfWeek"] = df["Date"].dt.dayofweek
df["IsWeekend"] = df["DayOfWeek"].isin([5,6]).astype(int)

df["IsPopularHour"] = df["Hour"].isin([17, 18, 19]).astype(int)

holidays = [
    "2025-01-01", "2025-01-26", "2025-03-17", "2025-04-10", "2025-05-01",
    "2025-08-15", "2025-10-02", "2025-11-14", "2025-12-25"
]
df["IsHoliday"] = df["Date"].isin(pd.to_datetime(holidays)).astype(int)

df["LogPrice"] = np.log1p(df["Price"])

features = ["Location", "Sport", "Hour", "Month", "DayOfWeek", "IsWeekend", "IsHoliday", "IsPopularHour"]
X = df[features]
y = df["LogPrice"]

cat_features = ["Location", "Sport"]
num_features = ["Hour", "Month", "DayOfWeek", "IsWeekend", "IsHoliday", "IsPopularHour"]

encoder = OneHotEncoder(handle_unknown="ignore",sparse_output=False)
X_cat = encoder.fit_transform(X[cat_features])

scaler = StandardScaler()
X_num = scaler.fit_transform(X[num_features])

X_full = np.hstack((X_cat, X_num))

X_train, X_test, y_train, y_test = train_test_split(X_full, y, test_size=0.2, random_state=42)

model = xgb.XGBRegressor(n_estimators=300, learning_rate=0.05, max_depth=6)
model.fit(X_train, y_train)

preds = model.predict(X_test)
rmse = root_mean_squared_error(y_test, preds)
print(f"RMSE: {rmse:.2f}")

joblib.dump(model, "price_model.json")
joblib.dump(encoder, "encoder.pkl")
joblib.dump(scaler, "scaler.pkl")
