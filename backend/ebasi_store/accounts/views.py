from rest_framework import generics, permissions, viewsets, serializers as drf_serializers
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, ContactMessageSerializer
import logging
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

logger = logging.getLogger(__name__)

class SensitiveAnonThrottle(AnonRateThrottle):
    scope = 'sensitive_anon'

class SensitiveUserThrottle(UserRateThrottle):
    scope = 'sensitive_user'

class AdminLoginView(APIView):
    """
    Login view specifically for admin users.
    Only allows login if user.is_staff is True.
    """
    permission_classes = (permissions.AllowAny,)
    throttle_classes = [SensitiveAnonThrottle, SensitiveUserThrottle]

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

class ContactMessageView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_classes = [SensitiveAnonThrottle, SensitiveUserThrottle]



