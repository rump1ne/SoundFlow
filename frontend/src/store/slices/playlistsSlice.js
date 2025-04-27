import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [
    {
      id: '1',
      name: 'Favorite Songs',
      description: 'Your favorite tracks',
      coverUrl: 'https://picsum.photos/200?random=1',
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Chill Vibes',
      description: 'Relaxing music for your downtime',
      coverUrl: 'https://picsum.photos/200?random=2',
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Workout Mix',
      description: 'High-energy tracks for your workout',
      coverUrl: 'https://picsum.photos/200?random=3',
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  likedSongs: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    createPlaylist: (state, action) => {
      const newPlaylist = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description || '',
        coverUrl: action.payload.coverUrl || 'https://picsum.photos/200?random=' + Date.now(),
        tracks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.playlists.push(newPlaylist);
    },
    updatePlaylist: (state, action) => {
      const { id, ...updates } = action.payload;
      const playlist = state.playlists.find(p => p.id === id);
      if (playlist) {
        Object.assign(playlist, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
    },
    addTrackToPlaylist: (state, action) => {
      const { playlistId, track } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist && !playlist.tracks.some(t => t.id === track.id)) {
        playlist.tracks.push(track);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    removeTrackFromPlaylist: (state, action) => {
      const { playlistId, trackId } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist) {
        playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    toggleLikedSong: (state, action) => {
      const trackId = action.payload;
      const index = state.likedSongs.findIndex(t => t.id === trackId);
      if (index === -1) {
        state.likedSongs.push(action.payload);
      } else {
        state.likedSongs.splice(index, 1);
      }
    },
    reorderPlaylistTracks: (state, action) => {
      const { playlistId, sourceIndex, targetIndex } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist) {
        const [removed] = playlist.tracks.splice(sourceIndex, 1);
        playlist.tracks.splice(targetIndex, 0, removed);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    setPlaylistsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPlaylistsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  toggleLikedSong,
  reorderPlaylistTracks,
  setPlaylistsLoading,
  setPlaylistsError,
} = playlistsSlice.actions;

export default playlistsSlice.reducer; 