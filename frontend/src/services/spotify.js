import SpotifyWebApi from 'spotify-web-api-node';
import { config } from '../config';

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  redirectUri: config.spotify.redirectUri
});

export const getSpotifyLoginUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private'
  ];

  return spotifyApi.createAuthorizeURL(scopes, 'state');
};

export const getAccessToken = async (code) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
};

export const searchTracks = async (query) => {
  try {
    const response = await spotifyApi.searchTracks(query);
    return response.body.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    const response = await spotifyApi.getUserPlaylists();
    return response.body.items;
  } catch (error) {
    console.error('Error getting user playlists:', error);
    throw error;
  }
};

export const createPlaylist = async (userId, name, description = '') => {
  try {
    const response = await spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: false
    });
    return response.body;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  try {
    const response = await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    return response.body;
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    throw error;
  }
};

export default spotifyApi; 