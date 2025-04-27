import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HeartIcon,
  QueueListIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid';
import {
  togglePlay,
  setVolume,
  toggleMute,
  playNext,
  playPrevious,
  toggleRepeat,
  toggleShuffle,
} from '../../store/slices/playerSlice';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: ${({ theme }) => theme.colors.background.navbar};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 100;
`;

const PlayerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
`;

const TrackImage = styled.div`
  width: 56px;
  height: 56px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TrackTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TrackArtist = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  &.play {
    width: 40px;
    height: 40px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      opacity: 0.9;
    }
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  max-width: 400px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => progress}%;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-width: 100px;
`;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Player = () => {
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeat,
    shuffle,
    queue,
  } = useSelector((state) => state.player);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          dispatch(togglePlay());
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, dispatch]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeat === 'track') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeat === 'queue' && queue.length === 0) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      dispatch(playNext());
    }
  };

  const handleProgressClick = (e) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeClick = (e) => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newVolume = Math.max(0, Math.min(1, pos));
      dispatch(setVolume(newVolume));
    }
  };

  const handleToggleMute = () => {
    dispatch(toggleMute());
  };

  return (
    <PlayerContainer>
      <PlayerContent>
        {currentTrack ? (
          <>
            <TrackInfo>
              <TrackImage>
                {currentTrack.coverArt ? (
                  <img src={currentTrack.coverArt} alt={currentTrack.title} />
                ) : (
                  <span>🎵</span>
                )}
              </TrackImage>
              <TrackDetails>
                <TrackTitle>{currentTrack.title}</TrackTitle>
                <TrackArtist>{currentTrack.artist}</TrackArtist>
              </TrackDetails>
            </TrackInfo>

            <PlayerControls>
              <ControlButton onClick={() => dispatch(toggleShuffle)} className={shuffle ? 'active' : ''}>
                <ArrowsRightLeftIcon />
              </ControlButton>
              <ControlButton onClick={() => dispatch(playPrevious)}>
                <BackwardIcon />
              </ControlButton>
              <ControlButton className="play" onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </ControlButton>
              <ControlButton onClick={() => dispatch(playNext)}>
                <ForwardIcon />
              </ControlButton>
              <ControlButton onClick={() => dispatch(toggleRepeat)} className={repeat !== 'none' ? 'active' : ''}>
                <ArrowPathRoundedSquareIcon />
              </ControlButton>
            </PlayerControls>

            <ProgressBar ref={progressRef} onClick={handleProgressClick}>
              <Progress progress={(currentTime / duration) * 100} />
            </ProgressBar>

            <TimeInfo>
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </TimeInfo>
          </>
        ) : (
          <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No track playing
          </div>
        )}
      </PlayerContent>
    </PlayerContainer>
  );
};

export default Player; 