from rest_framework import viewsets, routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Team, Activity, Workout, Leaderboard
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, WorkoutSerializer, LeaderboardSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

@api_view(['GET'])
def api_root(request):
    import os
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
        frontend_url = f"https://{codespace_name}-3000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
        frontend_url = "http://localhost:3000"
    
    return Response({
        'message': 'Welcome to OctoFit Tracker API',
        'version': '1.0.0',
        'environment': 'codespace' if codespace_name else 'localhost',
        'backend_url': base_url,
        'frontend_url': frontend_url,
        'endpoints': {
            'users': f'{base_url}/api/users/',
            'teams': f'{base_url}/api/teams/',
            'activities': f'{base_url}/api/activities/',
            'workouts': f'{base_url}/api/workouts/',
            'leaderboard': f'{base_url}/api/leaderboard/',
            'health': f'{base_url}/api/health/',
            'admin': f'{base_url}/admin/'
        },
        'documentation': {
            'api_root': f'{base_url}/',
            'admin_panel': f'{base_url}/admin/',
            'browsable_api': f'{base_url}/api/'
        }
    })
