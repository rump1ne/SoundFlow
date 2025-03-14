from rest_framework import serializers
from .models import Track, Playlist, Comment

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'