"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import UserViewSet, TeamViewSet, ActivityViewSet, WorkoutViewSet, LeaderboardViewSet, api_root
import os

# Configure URLs based on environment (codespace vs localhost)
codespace_name = os.environ.get('CODESPACE_NAME')
# Codespace URL format: https://$CODESPACE_NAME-8000.app.github.dev
# Frontend URL format: https://$CODESPACE_NAME-3000.app.github.dev

@api_view(['GET'])
def health_check(request):
    """Health check endpoint for the Django backend"""
    return Response({
        'status': 'healthy',
        'service': 'OctoFit Tracker Backend',
        'codespace': codespace_name if codespace_name else 'localhost',
        'backend_url': f"https://{codespace_name}-8000.app.github.dev" if codespace_name else "http://localhost:8000",
        'frontend_url': f"https://{codespace_name}-3000.app.github.dev" if codespace_name else "http://localhost:3000"
    })

@csrf_exempt
def cors_preflight(request):
    """Handle CORS preflight requests"""
    if request.method == 'OPTIONS':
        response = JsonResponse({'status': 'ok'})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# Create router for API endpoints
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/health/', health_check, name='health_check'),
    
    # CORS preflight handling
    path('api/cors/', cors_preflight, name='cors_preflight'),
    
    # API root - shows all available endpoints
    path('', api_root, name='api_root'),
    
    # Catch-all for API documentation
    path('docs/', api_root, name='api_docs'),
]
