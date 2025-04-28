import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracks: [],
  playlists: [],
  loading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setTracks: (state, action) => {
      state.tracks = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    addTrack: (state, action) => {
      state.tracks.push(action.payload);
    },
    addPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setTracks, 
  setPlaylists, 
  addTrack, 
  addPlaylist,
  setLoading,
  setError 
} = contentSlice.actions;

export default contentSlice.reducer; 