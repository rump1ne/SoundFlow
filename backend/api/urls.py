from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrackViewSet, PlaylistViewSet, register_user, login_user, 
    add_track_to_playlist, remove_track_from_playlist, update_playlist_name, delete_playlist, like_track, add_to_history, get_history, get_recommendations,
    follow_user, unfollow_user, get_following_tracks
)

router = DefaultRouter()
router.register(r'tracks', TrackViewSet)
router.register(r'playlists', PlaylistViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('tracks/<int:track_id>/like/', like_track, name='like_track'),
    path('tracks/<int:track_id>/history/', add_to_history, name='add_to_history'),
    path('history/', get_history, name='get_history'),
    path('recommendations/', get_recommendations, name='get_recommendations'),
    path('playlists/<int:playlist_id>/add-track/', add_track_to_playlist, name='add_track_to_playlist'),
    path('playlists/<int:playlist_id>/remove-track/<int:track_id>/', remove_track_from_playlist, name='remove_track_from_playlist'),
    path('playlists/<int:playlist_id>/update/', update_playlist_name, name='update_playlist_name'),
    path('playlists/<int:playlist_id>/delete/', delete_playlist, name='delete_playlist'),
    path('follow/<int:user_id>/', follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/', unfollow_user, name='unfollow_user'),
    path('following/tracks/', get_following_tracks, name='get_following_tracks'),
]