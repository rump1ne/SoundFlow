import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlayIcon,
  PauseIcon,
  QueueListIcon,
  ClockIcon,
  MusicalNoteIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { theme } from '../styles/theme';

const Container = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 1440px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.h6.fontSize};
  font-weight: ${theme.typography.h6.fontWeight};
  color: ${theme.colors.text.primary};
  margin: 0;

  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.text.secondary};
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  font-size: ${theme.typography.button.fontSize};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${theme.colors.primary.dark};
  }

  &:disabled {
    background-color: ${theme.colors.background.elevated};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Track = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: ${props =>
    props.isPlaying
      ? theme.colors.background.elevated
      : theme.colors.background.paper};
  border-radius: ${theme.borderRadius.md};
  cursor: ${props => (props.isDragging ? 'grabbing' : 'pointer')};
  transition: all ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }
`;

const TrackNumber = styled.span`
  width: 20px;
  text-align: center;
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.text.secondary};
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

const TrackCover = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.sm};
  object-fit: cover;
`;

const TrackMeta = styled.div`
  min-width: 0;
`;

const TrackTitle = styled.div`
  font-size: ${theme.typography.body1.fontSize};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackDuration = styled.span`
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.body1.fontSize};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

// Mock data for demonstration
const mockQueue = {
  currentTrack: {
    id: '1',
    title: 'Summer Breeze',
    artist: 'Coastal Waves',
    album: 'Ocean Vibes',
    duration: 235,
    cover: 'https://picsum.photos/60?random=1'
  },
  upcomingTracks: [
    {
      id: '2',
      title: 'Mountain High',
      artist: 'Peak Climbers',
      album: 'Alpine Dreams',
      duration: 184,
      cover: 'https://picsum.photos/60?random=2'
    },
    {
      id: '3',
      title: 'City Lights',
      artist: 'Urban Echo',
      album: 'Metropolitan',
      duration: 198,
      cover: 'https://picsum.photos/60?random=3'
    },
    {
      id: '4',
      title: 'Desert Wind',
      artist: 'Dune Walker',
      album: 'Sahara Nights',
      duration: 225,
      cover: 'https://picsum.photos/60?random=4'
    }
  ],
  recentlyPlayed: [
    {
      id: '5',
      title: 'Forest Rain',
      artist: 'Nature Sounds',
      album: 'Woodland Tales',
      duration: 246,
      cover: 'https://picsum.photos/60?random=5'
    },
    {
      id: '6',
      title: 'Ocean Waves',
      artist: 'Sea Breeze',
      album: 'Coastal Dreams',
      duration: 192,
      cover: 'https://picsum.photos/60?random=6'
    }
  ]
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Queue = () => {
  const [queue, setQueue] = useState(mockQueue);
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(queue.upcomingTracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQueue({
      ...queue,
      upcomingTracks: items
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Dispatch play/pause action
  };

  const handleSaveQueue = () => {
    // TODO: Implement save queue as playlist functionality
    console.log('Save queue as playlist');
  };

  const handleClearQueue = () => {
    setQueue({
      ...queue,
      upcomingTracks: []
    });
  };

  return (
    <Container>
      <Header>
        <Title>Queue</Title>
        <Description>Manage your currently playing music</Description>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <MusicalNoteIcon />
            Now Playing
          </SectionTitle>
          <Button onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </SectionHeader>
        {queue.currentTrack ? (
          <Track isPlaying={true}>
            <TrackNumber>
              <MusicalNoteIcon style={{ width: 16, height: 16 }} />
            </TrackNumber>
            <TrackInfo>
              <TrackCover src={queue.currentTrack.cover} alt={queue.currentTrack.title} />
              <TrackMeta>
                <TrackTitle>{queue.currentTrack.title}</TrackTitle>
                <TrackArtist>{queue.currentTrack.artist}</TrackArtist>
              </TrackMeta>
            </TrackInfo>
            <TrackDuration>{formatDuration(queue.currentTrack.duration)}</TrackDuration>
          </Track>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <MusicalNoteIcon />
            </EmptyStateIcon>
            <EmptyStateText>No track currently playing</EmptyStateText>
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <QueueListIcon />
            Next Up
          </SectionTitle>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button onClick={handleSaveQueue}>
              Save as Playlist
            </Button>
            <Button onClick={handleClearQueue} disabled={!queue.upcomingTracks.length}>
              Clear
            </Button>
          </div>
        </SectionHeader>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queue">
            {(provided) => (
              <TrackList
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {queue.upcomingTracks.length > 0 ? (
                  queue.upcomingTracks.map((track, index) => (
                    <Draggable
                      key={track.id}
                      draggableId={track.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Track
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                        >
                          <TrackNumber>{index + 1}</TrackNumber>
                          <TrackInfo>
                            <TrackCover src={track.cover} alt={track.title} />
                            <TrackMeta>
                              <TrackTitle>{track.title}</TrackTitle>
                              <TrackArtist>{track.artist}</TrackArtist>
                            </TrackMeta>
                          </TrackInfo>
                          <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
                        </Track>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyStateIcon>
                      <QueueListIcon />
                    </EmptyStateIcon>
                    <EmptyStateText>No upcoming tracks in the queue</EmptyStateText>
                  </EmptyState>
                )}
                {provided.placeholder}
              </TrackList>
            )}
          </Droppable>
        </DragDropContext>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <ClockIcon />
            Recently Played
          </SectionTitle>
        </SectionHeader>
        <TrackList>
          {queue.recentlyPlayed.length > 0 ? (
            queue.recentlyPlayed.map((track, index) => (
              <Track key={track.id}>
                <TrackNumber>
                  <ArrowPathIcon style={{ width: 16, height: 16 }} />
                </TrackNumber>
                <TrackInfo>
                  <TrackCover src={track.cover} alt={track.title} />
                  <TrackMeta>
                    <TrackTitle>{track.title}</TrackTitle>
                    <TrackArtist>{track.artist}</TrackArtist>
                  </TrackMeta>
                </TrackInfo>
                <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
              </Track>
            ))
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <ClockIcon />
              </EmptyStateIcon>
              <EmptyStateText>No recently played tracks</EmptyStateText>
            </EmptyState>
          )}
        </TrackList>
      </Section>
    </Container>
  );
};

export default Queue; 