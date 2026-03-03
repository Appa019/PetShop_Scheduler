import requests
import base64
import os

BASE_URL = "http://localhost:8000"

def run_test():
    print("--- 1. Registering/Logging In User ---")
    user_data = {"username": "testuser_aiFlow", "password": "password123", "name": "AI Tester"}
    res = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    if res.status_code == 400: # Already exists
        pass
    
    login_data = {"username": "testuser_aiFlow", "password": "password123"}
    res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if res.status_code != 200:
        print("Login failed:", res.text)
        return
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    print("\n--- 2. Creating Pet (Step 1) ---")
    # Create a dummy image
    with open("dummy.jpg", "wb") as f:
        f.write(b"dummy image data")
    
    pet_data = {"name": "TestDog", "age": "4 anos", "basic_info": "Adotado recentemente."}
    with open("dummy.jpg", "rb") as f:
        files = {"photo": ("dummy.jpg", f, "image/jpeg")}
        res = requests.post(f"{BASE_URL}/pets/", data=pet_data, files=files, headers=headers)
        
    if res.status_code != 200:
        print("Pet creation failed:", res.text)
        return
        
    pet = res.json()
    print("Pet created successfully:", pet["name"])
    print("AI Breed:", pet["ai_breed"])
    print("Suggested Symptoms:", pet["ai_suggested_symptoms"])
    
    print("\n--- 3. Generating Schedule (Step 2) ---")
    symptoms_payload = {"symptoms": ["Apatia", "Vomito"]}
    res = requests.post(f"{BASE_URL}/pets/{pet['id']}/appointment-suggestions", json=symptoms_payload, headers=headers)
    if res.status_code != 200:
        print("Schedule generation failed:", res.text)
        return
        
    schedule = res.json()
    print("Schedule generated successfully!")
    print("Next Recommended:", schedule.get("next_recommended"))
    for appt in schedule.get("appointments", []):
         print(f" - {appt['type']} (in {appt['interval_days']} days) Priority: {appt.get('priority')}")

    print("\n--- 4. Verifying Appointments in DB ---")
    import sqlite3
    conn = sqlite3.connect("backend/8patas.db")
    c = conn.cursor()
    c.execute("SELECT date_time, notes FROM appointments WHERE pet_id = ?", (pet['id'],))
    db_appts = c.fetchall()
    print(f"Found {len(db_appts)} appointments in DB for pet {pet['id']}:")
    for app in db_appts:
        print(" ->", app)
    conn.close()

if __name__ == "__main__":
    run_test()
