import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid';
import {
  togglePlay,
  setVolume,
  setCurrentTime,
  setRepeat,
  toggleShuffle,
  setDuration,
  setIsPlaying,
} from '../store/slices/playerSlice';

const Player = () => {
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    repeat,
    shuffle,
  } = useSelector((state) => state.player);

  useEffect(() => {
    if (currentTrack?.url) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          dispatch(setIsPlaying(false));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    dispatch(setCurrentTime(audioRef.current.currentTime));
  };

  const handleLoadedMetadata = () => {
    dispatch(setDuration(audioRef.current.duration));
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        dispatch(setIsPlaying(false));
      });
    }
  };

  const handleEnded = () => {
    if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      dispatch(setIsPlaying(false));
      // Handle next track logic here
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    dispatch(setVolume(parseFloat(e.target.value)));
  };

  const handleTimeChange = (e) => {
    dispatch(setCurrentTime(parseFloat(e.target.value)));
  };

  const handleRepeatToggle = () => {
    const nextRepeat = repeat === 'none' ? 'one' : repeat === 'one' ? 'all' : 'none';
    dispatch(setRepeat(nextRepeat));
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="text-white font-medium">{currentTrack.title}</h3>
            <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center space-y-2 w-2/4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleShuffle())}
              className={`text-gray-400 hover:text-white ${
                shuffle ? 'text-white' : ''
              }`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <BackwardIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => dispatch(togglePlay())}
              className="text-white hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white">
              <ForwardIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleRepeatToggle}
              className={`text-gray-400 hover:text-white ${
                repeat !== 'none' ? 'text-white' : ''
              }`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-gray-400 text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimeChange}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-400 text-sm">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <button className="text-gray-400 hover:text-white">
            {volume === 0 ? (
              <SpeakerXMarkIcon className="h-5 w-5" />
            ) : (
              <SpeakerWaveIcon className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default Player; 