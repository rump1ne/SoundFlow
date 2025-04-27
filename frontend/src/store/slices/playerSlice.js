import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  repeat: 'none', // 'none' | 'one' | 'all'
  shuffle: false,
  queue: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.currentTime = 0;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      if (action.payload > 0) {
        state.isMuted = false;
      }
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    toggleRepeat: (state) => {
      const modes = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((_, index) => index !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    playNext: (state) => {
      if (state.queue.length > 0) {
        state.currentTrack = state.queue[0];
        state.queue = state.queue.slice(1);
        state.isPlaying = true;
        state.currentTime = 0;
      } else if (state.repeat === 'all') {
        // Implementation for repeat all mode
      }
    },
    playPrevious: (state) => {
      if (state.currentTime > 3) {
        state.currentTime = 0;
      } else {
        // Implementation for previous track
      }
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlaying,
  togglePlay,
  setVolume,
  toggleMute,
  setCurrentTime,
  setDuration,
  setRepeat,
  toggleRepeat,
  toggleShuffle,
  setQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  playNext,
  playPrevious,
} = playerSlice.actions;

export default playerSlice.reducer; 