import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api/v1'

def print_response(response, label):
    print(f"\n--- {label} ---")
    print(f"Status Code: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

def verify_backend():
    # 1. Register User
    register_data = {
        "username": "testuser_verify",
        "email": "testuser_verify@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    # Check if user already exists or handle potential 400
    print("Registering User...")
    response = requests.post(f"{BASE_URL}/accounts/register/", data=register_data)
    print_response(response, "Registration")

    # 2. Login User
    login_data = {
        "username": "testuser_verify",
        "password": "testpassword123"
    }
    print("Logging in...")
    response = requests.post(f"{BASE_URL}/accounts/login/", data=login_data)
    print_response(response, "Login")
    
    if response.status_code == 200:
        token = response.json().get('token')
        headers = {'Authorization': f'Token {token}'}
        
        # 3. Get Profile
        print("Getting Profile...")
        response = requests.get(f"{BASE_URL}/accounts/profile/", headers=headers)
        print_response(response, "Profile")

        # 4. List Products (assuming some exist, or empty list)
        print("Listing Products...")
        response = requests.get(f"{BASE_URL}/products/")
        print_response(response, "Products")

        # 5. Check Cart (should be empty initially)
        print("Checking Cart...")
        response = requests.get(f"{BASE_URL}/orders/cart/", headers=headers)
        print_response(response, "Cart")

if __name__ == "__main__":
    verify_backend()
