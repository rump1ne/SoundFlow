import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  QueueListIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { theme } from '../../styles/theme';
import {
  togglePlay,
  setVolume,
  toggleMute,
  playNext,
  playPrevious,
  toggleRepeat,
  toggleShuffle,
  setCurrentTime,
  setDuration
} from '../../store/slices/playerSlice';
import Queue from './Queue';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: ${theme.colors.background.paper};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md};
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: ${theme.spacing.xl};
  align-items: center;
  z-index: 1000;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

const Cover = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
`;

const Info = styled.div`
  min-width: 0;
`;

const Title = styled.div`
  font-size: ${theme.typography.body1.fontSize};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'large' ? '48px' : '32px'};
  height: ${props => props.size === 'large' ? '48px' : '32px'};
  border-radius: 50%;
  border: none;
  background-color: ${props => 
    props.active ? theme.colors.primary.main : 'transparent'};
  color: ${props => 
    props.active 
      ? theme.colors.primary.contrastText 
      : theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${props =>
      props.active
        ? theme.colors.primary.dark
        : theme.colors.background.elevated};
  }

  svg {
    width: ${props => props.size === 'large' ? '24px' : '20px'};
    height: ${props => props.size === 'large' ? '24px' : '20px'};
  }

  &:disabled {
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
    background-color: transparent;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const Time = styled.span`
  font-size: ${theme.typography.caption.fontSize};
  color: ${theme.colors.text.secondary};
  min-width: 40px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: ${theme.colors.background.elevated};
  border-radius: ${theme.borderRadius.pill};
  cursor: pointer;
  position: relative;

  &:hover {
    .progress-hover {
      height: 6px;
      margin-top: -1px;
    }
  }
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${props =>
    props.active ? theme.colors.primary.main : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.pill};
  position: relative;
  transition: height 0.2s ease, margin-top 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${theme.colors.primary.main};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  ${ProgressBar}:hover & {
    &::after {
      opacity: 1;
    }
  }
`;

const ExtraControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 140px;
`;

const PlayerBar = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  // Redux state selectors
  const currentTrack = useSelector((state) => state.player.currentTrack);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const volume = useSelector((state) => state.player.volume);
  const isMuted = useSelector((state) => state.player.isMuted);
  const repeat = useSelector((state) => state.player.repeat);
  const shuffle = useSelector((state) => state.player.shuffle);
  const currentTime = useSelector((state) => state.player.currentTime);
  const duration = useSelector((state) => state.player.duration);

  // Effect to handle audio playback
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    dispatch(setCurrentTime(newTime));
  };

  const handleVolumeClick = (e) => {
    const volumeBar = e.currentTarget;
    const clickPosition = (e.clientX - volumeBar.getBoundingClientRect().left) / volumeBar.offsetWidth;
    const newVolume = Math.max(0, Math.min(1, clickPosition));
    dispatch(setVolume(newVolume));
  };

  const handleToggleMute = () => {
    dispatch(toggleMute());
  };

  const handleToggleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleToggleRepeat = () => {
    dispatch(toggleRepeat());
  };

  const handleToggleQueue = () => {
    setIsQueueOpen(!isQueueOpen);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Container>
        <TrackInfo>
          {currentTrack && (
            <>
              <Cover src={currentTrack.cover} alt={currentTrack.title} />
              <Info>
                <Title>{currentTrack.title}</Title>
                <Artist>{currentTrack.artist}</Artist>
              </Info>
            </>
          )}
        </TrackInfo>

        <Controls>
          <ButtonGroup>
            <IconButton onClick={handleToggleShuffle} active={shuffle}>
              <ArrowsRightLeftIcon />
            </IconButton>
            <IconButton onClick={handlePrevious}>
              <BackwardIcon />
            </IconButton>
            <IconButton size="large" onClick={handlePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <IconButton onClick={handleNext}>
              <ForwardIcon />
            </IconButton>
            <IconButton onClick={handleToggleRepeat} active={repeat}>
              <ArrowPathRoundedSquareIcon />
            </IconButton>
          </ButtonGroup>

          <ProgressContainer>
            <Time>{formatTime(currentTime)}</Time>
            <ProgressBar onClick={handleProgressClick}>
              <Progress
                className="progress-hover"
                style={{ width: `${(currentTime / duration) * 100}%` }}
                active={true}
              />
            </ProgressBar>
            <Time>{formatTime(duration)}</Time>
          </ProgressContainer>
        </Controls>

        <ExtraControls>
          <VolumeControl>
            <IconButton onClick={handleToggleMute}>
              {isMuted || volume === 0 ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
            </IconButton>
            <ProgressBar onClick={handleVolumeClick}>
              <Progress
                className="progress-hover"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                active={true}
              />
            </ProgressBar>
          </VolumeControl>
          <IconButton onClick={handleToggleQueue} active={isQueueOpen}>
            <QueueListIcon />
          </IconButton>
        </ExtraControls>

        <audio
          ref={audioRef}
          src={currentTrack?.url}
          onTimeUpdate={() => dispatch(setCurrentTime(audioRef.current.currentTime))}
          onDurationChange={() => dispatch(setDuration(audioRef.current.duration))}
          onEnded={() => handleNext()}
        />
      </Container>
      <Queue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </>
  );
};

export default PlayerBar; 