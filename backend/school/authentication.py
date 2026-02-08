"""
Custom JWT Authentication using HttpOnly Cookies.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that reads JWT from HttpOnly cookies
    instead of Authorization header.
    """
    
    def authenticate(self, request):
        # Try to get the access token from cookie
        raw_token = request.COOKIES.get(settings.ACCESS_TOKEN_COOKIE)
        
        if raw_token is None:
            return None
        
        # Validate the token
        validated_token = self.get_validated_token(raw_token)
        
        return self.get_user(validated_token), validated_token
