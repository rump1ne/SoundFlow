from rest_framework import viewsets, permissions
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