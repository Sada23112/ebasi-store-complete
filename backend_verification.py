import requests
import json
import sys
import os

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:8000/api/v1")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

def test_api():
    print("Starting Backend API Verification...")
    errors = []

    # 1. Test Products API (Public)
    try:
        response = requests.get(f"{BASE_URL}/products/")
        if response.status_code == 200:
            print("✅ Products API is accessible")
        else:
            errors.append(f"Products API failed: {response.status_code}")
    except Exception as e:
        errors.append(f"Products API error: {e}")

    # 2. Test Contact API (Public POST)
    try:
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "subject": "general",
            "message": "This is a test message from verification script."
        }
        response = requests.post(f"{BASE_URL}/accounts/contact/", json=data)
        if response.status_code in [200, 201]:
            print("✅ Contact API is working")
        else:
            errors.append(f"Contact API failed: {response.status_code} - {response.text}")
    except Exception as e:
        errors.append(f"Contact API error: {e}")

    # 3. Test Admin Login (Configurable via env vars)
    token = None
    if ADMIN_PASSWORD:
        try:
            data = {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
            response = requests.post(f"{BASE_URL}/accounts/admin/login/", json=data)
            if response.status_code == 200:
                print(f"✅ Admin Login successful for '{ADMIN_USERNAME}'")
                token = response.json().get("token")
            else:
                errors.append(f"Admin Login failed: {response.status_code} - {response.text}")
        except Exception as e:
            errors.append(f"Admin Login error: {e}")
    else:
        print("ℹ️ Skipping Admin Login verification: ADMIN_PASSWORD environment variable not provided.")

    # 4. Test Authenticated Endpoints (if login successful)
    if token:
        headers = {"Authorization": f"Token {token}"}
        
        # Dashboard Stats
        try:
            response = requests.get(f"{BASE_URL}/admin/dashboard/", headers=headers)
            if response.status_code == 200:
                print("✅ Admin Dashboard API is accessible")
            else:
                errors.append(f"Admin Dashboard API failed: {response.status_code}")
        except Exception as e:
            errors.append(f"Admin Dashboard error: {e}")

        # Users List
        try:
            response = requests.get(f"{BASE_URL}/admin/users/", headers=headers)
            if response.status_code == 200:
                print("✅ Admin Users API is accessible")
            else:
                errors.append(f"Admin Users API failed: {response.status_code}")
        except Exception as e:
            errors.append(f"Admin Users error: {e}")

    # Summary
    print("\nVerification Summary:")
    if not errors:
        print("🎉 ALL CHECKS PASSED! The backend is fully operational.")
    else:
        print("❌ SOME CHECKS FAILED:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)

if __name__ == "__main__":
    test_api()
