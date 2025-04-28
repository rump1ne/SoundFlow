const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

class MusicMetadataService {
    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI
        });
    }

    async initialize() {
        try {
            const data = await this.spotifyApi.clientCredentialsGrant();
            this.spotifyApi.setAccessToken(data.body['access_token']);
            console.log('Spotify API initialized successfully');
        } catch (error) {
            console.error('Error initializing Spotify API:', error);
            throw error;
        }
    }

    async searchTrack(query) {
        try {
            const response = await this.spotifyApi.searchTracks(query);
            return response.body.tracks.items.map(track => ({
                title: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                releaseDate: track.album.release_date,
                duration: track.duration_ms,
                spotifyId: track.id,
                previewUrl: track.preview_url,
                albumArtUrl: track.album.images[0]?.url
            }));
        } catch (error) {
            console.error('Error searching tracks:', error);
            throw error;
        }
    }

    async getTrackMetadata(spotifyId) {
        try {
            const track = await this.spotifyApi.getTrack(spotifyId);
            return {
                title: track.body.name,
                artist: track.body.artists.map(artist => artist.name).join(', '),
                album: track.body.album.name,
                releaseDate: track.body.album.release_date,
                duration: track.body.duration_ms,
                spotifyId: track.body.id,
                previewUrl: track.body.preview_url,
                albumArtUrl: track.body.album.images[0]?.url,
                popularity: track.body.popularity,
                explicit: track.body.explicit
            };
        } catch (error) {
            console.error('Error getting track metadata:', error);
            throw error;
        }
    }

    async getAudioFeatures(spotifyId) {
        try {
            const features = await this.spotifyApi.getAudioFeaturesForTrack(spotifyId);
            return {
                danceability: features.body.danceability,
                energy: features.body.energy,
                key: features.body.key,
                loudness: features.body.loudness,
                mode: features.body.mode,
                tempo: features.body.tempo,
                timeSignature: features.body.time_signature,
                instrumentalness: features.body.instrumentalness,
                valence: features.body.valence
            };
        } catch (error) {
            console.error('Error getting audio features:', error);
            throw error;
        }
    }
}

module.exports = new MusicMetadataService(); 