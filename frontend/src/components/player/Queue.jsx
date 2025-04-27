import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  PlayIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { theme } from '../../styles/theme';
import { setCurrentTrack, removeFromQueue, reorderQueue } from '../../store/slices/playerSlice';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background-color: ${theme.colors.background.paper};
  border-left: 1px solid ${theme.colors.border};
  transition: right ${theme.transitions.duration.standard}ms;
  z-index: 1100;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: ${theme.typography.h6.fontSize};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const QueueList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.background.elevated};
    border-radius: ${theme.borderRadius.pill};
  }
`;

const QueueItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }

  ${props => props.isPlaying && `
    background-color: ${theme.colors.primary.light};
    &:hover {
      background-color: ${theme.colors.primary.light};
    }
  `}
`;

const DragHandle = styled.div`
  cursor: grab;
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  
  &:active {
    cursor: grabbing;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Cover = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.sm};
  object-fit: cover;
`;

const Details = styled.div`
  min-width: 0;
`;

const TrackTitle = styled.div`
  font-size: ${theme.typography.body2.fontSize};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: ${theme.typography.caption.fontSize};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    background-color: ${theme.colors.background.default};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Queue = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.player.queue);
  const currentTrack = useSelector((state) => state.player.currentTrack);

  const handleTrackClick = (track) => {
    dispatch(setCurrentTrack(track));
  };

  const handleRemoveTrack = (trackId) => {
    dispatch(removeFromQueue(trackId));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== targetIndex) {
      dispatch(reorderQueue({ sourceIndex, targetIndex }));
    }
  };

  return (
    <Container isOpen={isOpen}>
      <Header>
        <Title>Play Queue</Title>
        <CloseButton onClick={onClose}>
          <XMarkIcon />
        </CloseButton>
      </Header>
      <QueueList>
        {queue.map((track, index) => (
          <QueueItem
            key={track.id}
            isPlaying={currentTrack?.id === track.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <DragHandle>
              <Bars3Icon />
            </DragHandle>
            <TrackInfo onClick={() => handleTrackClick(track)}>
              <Cover src={track.cover} alt={track.title} />
              <Details>
                <TrackTitle>{track.title}</TrackTitle>
                <Artist>{track.artist}</Artist>
              </Details>
            </TrackInfo>
            <Actions>
              <IconButton onClick={() => handleRemoveTrack(track.id)}>
                <XMarkIcon />
              </IconButton>
            </Actions>
          </QueueItem>
        ))}
      </QueueList>
    </Container>
  );
};

export default Queue; 