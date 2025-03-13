from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrackViewSet, PlaylistViewSet, register_user, login_user, 
    add_track_to_playlist, remove_track_from_playlist, update_playlist_name, delete_playlist
)

router = DefaultRouter()
router.register(r'tracks', TrackViewSet)
router.register(r'playlists', PlaylistViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('playlists/<int:playlist_id>/add-track/', add_track_to_playlist, name='add_track_to_playlist'),
    path('playlists/<int:playlist_id>/remove-track/<int:track_id>/', remove_track_from_playlist, name='remove_track_from_playlist'),
    path('playlists/<int:playlist_id>/update/', update_playlist_name, name='update_playlist_name'),
    path('playlists/<int:playlist_id>/delete/', delete_playlist, name='delete_playlist'),
]