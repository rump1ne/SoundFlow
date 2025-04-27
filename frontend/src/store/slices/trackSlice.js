import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracks: [],
  albums: [],
  favorites: [],
  recentlyPlayed: [],
  currentTrack: null,
  isLoading: false,
  error: null,
  searchResults: [],
  filters: {
    genre: 'all',
    year: 'all',
    duration: 'all',
  },
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setTracks: (state, action) => {
      state.tracks = action.payload;
    },
    setAlbums: (state, action) => {
      state.albums = action.payload;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setRecentlyPlayed: (state, action) => {
      state.recentlyPlayed = action.payload;
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(track => track.id !== action.payload);
    },
    addToRecentlyPlayed: (state, action) => {
      // Keep only the last 50 tracks
      state.recentlyPlayed = [action.payload, ...state.recentlyPlayed.slice(0, 49)];
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
    },
    removeTrack: (state, action) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
    },
    updateTrack: (state, action) => {
      const index = state.tracks.findIndex(track => track.id === action.payload.id);
      if (index !== -1) {
        state.tracks[index] = { ...state.tracks[index], ...action.payload };
      }
    },
  },
});

export const {
  setTracks,
  setAlbums,
  setFavorites,
  setRecentlyPlayed,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyPlayed,
  setSearchResults,
  setFilters,
  setLoading,
  setError,
  addTrack,
  removeTrack,
  updateTrack,
} = trackSlice.actions;

export default trackSlice.reducer; 