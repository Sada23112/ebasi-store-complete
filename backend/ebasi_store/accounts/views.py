from rest_framework import generics, permissions, viewsets, serializers as drf_serializers
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, AddressSerializer, ContactMessageSerializer
from .models import Address
import requests
from decouple import config

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomAuthToken(APIView):
    """
    Custom login view that accepts either 'username' or 'email' + 'password'.
    This allows the frontend to send email in the login form.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # Accept either 'username' or 'email' field
        username = request.data.get('username', '')
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        user = None

        # Try authenticating with username first
        if username:
            user = authenticate(username=username, password=password)

        # If no username provided or auth failed, try with email
        if user is None and email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        # If still no user, try using the email value as username
        if user is None and email:
            user = authenticate(username=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email,
                'username': user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=400
            )

class AdminLoginView(APIView):
    """
    Login view specifically for admin users.
    Only allows login if user.is_staff is True.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        user = None

        if username:
            user = authenticate(username=username, password=password)

        if user is None and email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if user is None and email:
             user = authenticate(username=email, password=password)

        if user is not None:
            if not user.is_staff:
                 return Response(
                    {'error': 'You do not have permission to access the admin panel.'},
                    status=403
                )

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email,
                'username': user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=400
            )

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ContactMessageView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = (permissions.AllowAny,)

class GoogleLogin(APIView):
    """
    Custom Google OAuth login view.
    Accepts an authorization code from the frontend, exchanges it with Google
    for user info, creates or finds the user, and returns an auth token.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code is required'}, status=400)

        client_id = config('GOOGLE_CLIENT_ID', default='')
        client_secret = config('GOOGLE_CLIENT_SECRET', default='')
        redirect_uri = request.data.get('redirect_uri', 'http://localhost:3000/auth/google/callback')

        if not client_id or not client_secret:
            return Response({'error': 'Google OAuth is not configured on the server'}, status=500)

        # Step 1: Exchange authorization code for access token
        try:
            print(f"[GoogleLogin] Exchanging code with redirect_uri: {redirect_uri}")
            token_response = requests.post('https://oauth2.googleapis.com/token', data={
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
            })
            token_data = token_response.json()
            print(f"[GoogleLogin] Google token response: {token_data}")

            if 'error' in token_data:
                return Response({
                    'error': f"Failed to exchange code: {token_data.get('error_description', token_data['error'])}"
                }, status=400)

            access_token = token_data.get('access_token')
        except Exception as e:
            print(f"[GoogleLogin] Exception during token exchange: {e}")
            return Response({'error': f'Failed to exchange code for token: {str(e)}'}, status=500)

        # Step 2: Get user info from Google
        try:
            userinfo_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            userinfo = userinfo_response.json()

            if 'error' in userinfo:
                return Response({'error': 'Failed to get user info from Google'}, status=400)

            email = userinfo.get('email')
            first_name = userinfo.get('given_name', '')
            last_name = userinfo.get('family_name', '')
            google_id = userinfo.get('id')
            picture = userinfo.get('picture', '')

            if not email:
                return Response({'error': 'Email not provided by Google'}, status=400)

        except Exception as e:
            return Response({'error': f'Failed to fetch user info: {str(e)}'}, status=500)

        # Step 3: Find or create user
        user = User.objects.filter(email=email).first()
        if not user:
            # Create new user with Google info
            username = email.split('@')[0]
            # Ensure unique username
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                password=None,  # No password for social auth users
            )
        else:
            # Update name if not set
            if not user.first_name and first_name:
                user.first_name = first_name
            if not user.last_name and last_name:
                user.last_name = last_name
            user.save()

        # Step 4: Generate auth token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'picture': picture,
        })


