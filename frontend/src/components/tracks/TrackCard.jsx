import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {
  PlayIcon,
  PauseIcon,
  EllipsisHorizontalIcon,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { setCurrentTrack, togglePlay } from '../../store/slices/playerSlice';

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};

    .controls {
      opacity: 1;
    }
  }
`;

const CoverArt = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: ${({ $isCurrentTrack }) => ($isCurrentTrack ? 1 : 0)};
  transition: ${({ theme }) => theme.transitions.default};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ $isLiked, theme }) => 
      $isLiked ? theme.colors.error : theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &.play-button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    
    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary}dd;
      transform: scale(1.1);
    }
  }
`;

const Duration = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-width: 40px;
  text-align: right;
`;

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TrackCard = ({ track, isPlaying, isCurrentTrack, onPlay, onLike, onOptions }) => {
  const dispatch = useDispatch();

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      dispatch(togglePlay());
    } else {
      dispatch(setCurrentTrack(track));
    }
    onPlay?.(track);
  }, [dispatch, isCurrentTrack, track, onPlay]);

  const handleOptionsClick = useCallback((e) => {
    e.stopPropagation();
    onOptions?.(track);
  }, [track, onOptions]);

  const handleLikeClick = useCallback((e) => {
    e.stopPropagation();
    onLike?.(track);
  }, [track, onLike]);

  // Get artist name from the Artist association
  const artistName = track.Artist?.name || 'Unknown Artist';
  // Get album cover from the Album association
  const albumCover = track.Album?.imageUrl || 'https://via.placeholder.com/48';

  return (
    <Card>
      <CoverArt src={albumCover} alt={`${track.title} cover art`} />
      <TrackInfo>
        <Title>{track.title}</Title>
        <Artist>{artistName}</Artist>
      </TrackInfo>
      <Controls className="controls" $isCurrentTrack={isCurrentTrack}>
        <IconButton
          className="play-button"
          onClick={handlePlay}
          aria-label={isPlaying && isCurrentTrack ? 'Pause' : 'Play'}
        >
          {isPlaying && isCurrentTrack ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <IconButton
          onClick={handleLikeClick}
          aria-label={track.isLiked ? 'Unlike track' : 'Like track'}
          $isLiked={track.isLiked}
        >
          {track.isLiked ? <HeartIconSolid /> : <HeartIconOutline />}
        </IconButton>
        <IconButton
          onClick={handleOptionsClick}
          aria-label="More options"
        >
          <EllipsisHorizontalIcon />
        </IconButton>
      </Controls>
      <Duration>{formatDuration(track.duration)}</Duration>
    </Card>
  );
};

export default TrackCard; 