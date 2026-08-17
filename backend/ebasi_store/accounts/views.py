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

from admin_api.permissions import get_user_role, get_user_permissions
from admin_api.models import log_audit

class AdminLoginView(APIView):
    """
    Login view specifically for admin and staff users.
    Only allows login if user.is_staff is True and user.is_active is True.
    Returns auth token along with role and permissions.
    """
    permission_classes = (permissions.AllowAny,)
    throttle_classes = [SensitiveAnonThrottle, SensitiveUserThrottle]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        user = None

        if username:
            user = authenticate(username=username, password=password)

        if user is None and email:
            try:
                user_obj = User.objects.get(email__iexact=email)
                user = authenticate(username=user_obj.username, password=password)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                pass
        
        if user is None and email:
            user = authenticate(username=email, password=password)

        if user is None:
            # Check if user exists with matching password but is marked inactive
            candidate = None
            if username:
                candidate = User.objects.filter(username__iexact=username).first()
            if candidate is None and email:
                candidate = User.objects.filter(email__iexact=email).first()

            if candidate and candidate.check_password(password) and not candidate.is_active:
                return Response(
                    {'error': 'This staff account has been deactivated. Please contact an Owner.'},
                    status=403
                )

        if user is not None:
            if not user.is_active:
                return Response(
                    {'error': 'This staff account has been deactivated. Please contact an Owner.'},
                    status=403
                )

            if not user.is_staff and not user.is_superuser:
                return Response(
                    {'error': 'You do not have permission to access the admin panel.'},
                    status=403
                )

            token, created = Token.objects.get_or_create(user=user)
            role = get_user_role(user)
            permissions_list = sorted(list(get_user_permissions(user)))

            # Log login audit
            log_audit(
                request,
                action='staff.login',
                target=user,
                target_repr=user.username,
                details={'role': role, 'username': user.username}
            )

            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': role,
                'permissions': permissions_list,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        else:
            return Response(
                {'error': 'Invalid username, email, or password.'},
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



