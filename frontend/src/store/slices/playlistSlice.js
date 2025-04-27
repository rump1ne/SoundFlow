import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    addPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },
    updatePlaylist: (state, action) => {
      const index = state.playlists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = { ...state.playlists[index], ...action.payload };
      }
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlaylists,
  setCurrentPlaylist,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
  setLoading,
  setError,
} = playlistSlice.actions;

export default playlistSlice.reducer; 