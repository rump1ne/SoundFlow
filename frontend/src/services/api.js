import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Instead of forcing a reload, just reject the promise
      // The component can handle the navigation
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const fetchTracks = async () => {
  const response = await api.get('/api/tracks');
  return response.data;
};

export const fetchPlaylists = async () => {
  const response = await api.get('/api/playlists');
  return response.data;
};

export const createPlaylist = async (playlistData) => {
  const response = await api.post('/api/playlists', playlistData);
  return response.data;
};

export const updatePlaylist = async (playlistId, playlistData) => {
  const response = await api.put(`/api/playlists/${playlistId}`, playlistData);
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/api/playlists/${playlistId}`);
  return response.data;
};

export const addTrackToPlaylist = async (playlistId, trackId) => {
  const response = await api.post(`/api/playlists/${playlistId}/tracks`, { trackId });
  return response.data;
};

export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  const response = await api.delete(`/api/playlists/${playlistId}/tracks/${trackId}`);
  return response.data;
};

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.success && response.data.data) {
        return response;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('An error occurred. Please try again.');
      }
    }
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me'),
};

export const playlistAPI = {
  getPlaylist: (id) => api.get(`/api/playlists/${id}`),
  updatePlaylist: (id, data) => api.put(`/api/playlists/${id}`, data),
  deletePlaylist: (id) => api.delete(`/api/playlists/${id}`),
  removeTrack: (playlistId, trackId) => api.delete(`/api/playlists/${playlistId}/tracks/${trackId}`),
};

export const trackAPI = {
  getTrack: (id) => api.get(`/api/tracks/${id}`),
  searchTracks: (query) => api.get(`/api/tracks/search?q=${query}`),
  likeTrack: (id) => api.post(`/api/tracks/${id}/like`),
  unlikeTrack: (id) => api.delete(`/api/tracks/${id}/like`),
};

export const userAPI = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  updateProfile: (id, data) => api.put(`/api/users/${id}`, data),
  followUser: (id) => api.post(`/api/users/${id}/follow`),
  unfollowUser: (id) => api.delete(`/api/users/${id}/follow`),
};

export default api; 