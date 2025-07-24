import csv
import random
from datetime import datetime, timedelta
import numpy as np

# Configuration
locations = ["Andheri", "Dharavi", "Bandra", "Juhu", "Goregaon"]
sports = ["Cricket", "Football", "Pickleball", "Badminton", "Tennis"]

sport_popularity = {
    "Cricket": 1.5,
    "Football": 1.4,
    "Pickleball": 1.1,
    "Badminton": 1.2,
    "Tennis": 1.3
}

location_popularity = {
    "Andheri": 1.4,
    "Dharavi": 0.9,
    "Bandra": 1.5,
    "Juhu": 1.3,
    "Goregaon": 1.0
}

timeslots = [f"{str(h).zfill(2)}:00-{str(h+1).zfill(2)}:00" for h in range(7, 20 + 1)]

holiday_dates = {
    "2025-01-26", "2025-03-17", "2025-08-15", "2025-10-02", "2025-12-25",
    "2025-11-01", "2025-07-23", "2025-08-30", "2025-09-19", "2025-10-20"
}

start_date = datetime.strptime("2025-07-01", "%Y-%m-%d")
end_date = datetime.strptime("2025-12-31", "%Y-%m-%d")

data = []
while len(data) < 30000:
    date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    day_name = date.strftime("%A")
    date_str = date.strftime("%Y-%m-%d")

    location = random.choice(locations)
    sport = random.choice(sports)
    timeslot = random.choice(timeslots)

    base_price = random.uniform(475, 575)

    if day_name in ["Saturday", "Sunday"]:
        base_price *= 1.3 

    holiday_multiplier = 1.0

    holiday_dates_dt = [datetime.strptime(d, "%Y-%m-%d") for d in holiday_dates]

    current_date = datetime.strptime(date_str, "%Y-%m-%d")
    for holiday in holiday_dates_dt:
        delta_days = abs((holiday - current_date).days)
        if delta_days == 0:
            holiday_multiplier = max(holiday_multiplier, 1.3)  # peak
        elif delta_days == 1:
            holiday_multiplier = max(holiday_multiplier, 1.15)
        elif delta_days == 2:
            holiday_multiplier = max(holiday_multiplier, 1.05)

    base_price *= holiday_multiplier

    hour = int(timeslot.split(":")[0])
    if 17 <= hour <= 20:
        base_price *= 1.2
    base_price *= sport_popularity[sport]
    base_price *= location_popularity[location]

    final_price = int(round(base_price / 50.0) * 50)

    data.append([date_str, day_name, location, timeslot, sport, final_price])

filename = "sports_booking_data.csv"
with open(filename, "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Date", "Day", "Location", "TimeSlot", "Sport", "Price"])
    writer.writerows(data)

print(f"CSV generated: {filename} with {len(data)} rows.")
