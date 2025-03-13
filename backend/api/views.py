from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Track, Playlist
from .serializers import TrackSerializer, PlaylistSerializer

class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_track_to_playlist(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    track_id = request.data.get('track_id')
    track = Track.objects.get(id=track_id)
    playlist.tracks.add(track)
    return Response({'message': 'Track added successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_track_from_playlist(request, playlist_id, track_id):
    playlist = Playlist.objects.get(id=playlist_id)
    track = Track.objects.get(id=track_id)
    playlist.tracks.remove(track)
    return Response({'message': 'Track removed successfully'}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_playlist_name(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    new_name = request.data.get('name')
    playlist.name = new_name
    playlist.save()
    return Response({'message': 'Playlist updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_playlist(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    playlist.delete()
    return Response({'message': 'Playlist deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = User.objects.filter(username=username).first()
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)