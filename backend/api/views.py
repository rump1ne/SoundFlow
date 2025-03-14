from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Track, Playlist, ListeningHistory, UserSubscription
from .serializers import TrackSerializer, PlaylistSerializer
from django.db.models import Count

class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
def follow_user(request, user_id):
    follower = request.user
    following = User.objects.get(id=user_id)
    if UserSubscription.objects.filter(follower=follower, following=following).exists():
        return Response({'message': 'Already following'}, status=status.HTTP_400_BAD_REQUEST)
    UserSubscription.objects.create(follower=follower, following=following)
    return Response({'message': 'Now following user'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, user_id):
    follower = request.user
    following = User.objects.get(id=user_id)
    subscription = UserSubscription.objects.filter(follower=follower, following=following)
    if subscription.exists():
        subscription.delete()
        return Response({'message': 'Unfollowed user'}, status=status.HTTP_200_OK)
    return Response({'message': 'Not following this user'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_following_tracks(request):
    following_users = request.user.following.values_list('following', flat=True)
    tracks = Track.objects.filter(added_by__in=following_users).order_by('-id')
    data = [{'id': track.id, 'title': track.title, 'artist': track.artist} for track in tracks]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_playlist_name(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    new_name = request.data.get('name')
    playlist.name = new_name
    playlist.save()
    return Response({'message': 'Playlist updated successfully'}, status=status.HTTP_200_OK)