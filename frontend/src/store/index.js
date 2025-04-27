import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import playerReducer from './slices/playerSlice';
import playlistReducer from './slices/playlistSlice';
import trackReducer from './slices/trackSlice';
import playlistsReducer from './slices/playlistsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    playlist: playlistReducer,
    track: trackReducer,
    playlists: playlistsReducer,
  },
});

export default store; 