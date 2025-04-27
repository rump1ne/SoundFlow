import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import Icon from '../components/common/Icon';
import { theme } from '../styles/theme';

const ArtistContainer = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const ArtistHeader = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ArtistImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.secondary.main} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArtistInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ArtistName = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ArtistBio = styled.p`
  font-size: 1rem;
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

const ArtistStats = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.text.primary};
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.lg};
`;

const Tab = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: none;
  color: ${props => props.active ? theme.colors.primary.main : theme.colors.text.secondary};
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary.main : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${theme.colors.primary.main};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const TrackListItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  background: white;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const TrackImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.sm};
  background: linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.secondary.light} 100%);
  margin-right: ${theme.spacing.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  font-size: 1rem;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const TrackArtist = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const TrackDuration = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.text.secondary};
  margin-left: ${theme.spacing.md};
`;

const TrackActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${theme.colors.primary.main};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${theme.colors.primary.dark};
  }
`;

const Artist = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tracks');
  const [viewMode, setViewMode] = useState('grid');
  
  // Mock data for demonstration
  const mockArtist = {
    id: 1,
    name: 'Artist Name',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    coverImage: 'https://picsum.photos/800/400',
    profileImage: 'https://picsum.photos/200',
    followers: 1234567,
    monthlyListeners: 8901234,
    topTracks: [
      {
        id: 1,
        title: 'Track One',
        cover: 'https://picsum.photos/60',
        duration: 180,
      },
      {
        id: 2,
        title: 'Track Two',
        cover: 'https://picsum.photos/60',
        duration: 240,
      },
      {
        id: 3,
        title: 'Track Three',
        cover: 'https://picsum.photos/60',
        duration: 200,
      },
    ],
    albums: [
      {
        id: 1,
        title: 'Album One',
        cover: 'https://picsum.photos/200',
        year: 2020,
      },
      {
        id: 2,
        title: 'Album Two',
        cover: 'https://picsum.photos/200',
        year: 2021,
      },
    ],
    relatedArtists: [
      {
        id: 1,
        name: 'Related Artist One',
        image: 'https://picsum.photos/100',
      },
      {
        id: 2,
        name: 'Related Artist Two',
        image: 'https://picsum.photos/100',
      },
      {
        id: 3,
        name: 'Related Artist Three',
        image: 'https://picsum.photos/100',
      },
    ],
  };
  
  const handlePlayTrack = (track) => {
    console.log('Playing track:', track);
    // In a real app, this would dispatch an action to play the track
  };
  
  const handleAddToPlaylist = (track) => {
    console.log('Adding track to playlist:', track);
    // In a real app, this would open a modal to select a playlist
  };
  
  const handleToggleFavorite = (track) => {
    console.log('Toggling favorite for track:', track);
    // In a real app, this would dispatch an action to toggle the favorite status
  };
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'tracks':
        return viewMode === 'grid' ? (
          <Grid>
            {mockArtist.topTracks.map(track => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onPlay={() => handlePlayTrack(track)}
                onAddToPlaylist={() => handleAddToPlaylist(track)}
                onToggleFavorite={() => handleToggleFavorite(track)}
              />
            ))}
          </Grid>
        ) : (
          <ListContainer>
            {mockArtist.topTracks.map(track => (
              <TrackListItem key={track.id}>
                <TrackImage>
                  <img src={track.cover} alt={track.title} />
                </TrackImage>
                <TrackInfo>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>{track.artist}</TrackArtist>
                </TrackInfo>
                <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
                <TrackActions>
                  <IconButton onClick={() => handlePlayTrack(track)}>
                    <Icon name="play" />
                  </IconButton>
                  <IconButton onClick={() => handleAddToPlaylist(track)}>
                    <Icon name="add" />
                  </IconButton>
                  <IconButton onClick={() => handleToggleFavorite(track)}>
                    <Icon name="favorite" />
                  </IconButton>
                </TrackActions>
              </TrackListItem>
            ))}
          </ListContainer>
        );
      case 'albums':
        return (
          <Grid>
            {mockArtist.albums.map(album => (
              <PlaylistCard 
                key={album.id} 
                playlist={{
                  id: album.id,
                  title: album.title,
                  description: `${album.year} • ${album.tracks} tracks`,
                  cover: album.cover,
                  trackCount: album.tracks,
                  duration: 0,
                  owner: mockArtist.name
                }} 
              />
            ))}
          </Grid>
        );
      case 'related':
        return (
          <Grid>
            {mockArtist.relatedArtists.map(relatedArtist => (
              <PlaylistCard 
                key={relatedArtist.id} 
                playlist={{
                  id: relatedArtist.id,
                  title: relatedArtist.name,
                  description: 'Related Artist',
                  cover: relatedArtist.image,
                  trackCount: 0,
                  duration: 0,
                  owner: relatedArtist.name
                }} 
              />
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };
  
  return (
    <ArtistContainer>
      <ArtistHeader>
        <ArtistImage>
          {mockArtist.profileImage ? (
            <img src={mockArtist.profileImage} alt={mockArtist.name} />
          ) : (
            mockArtist.name.charAt(0)
          )}
        </ArtistImage>
        <ArtistInfo>
          <ArtistName>{mockArtist.name}</ArtistName>
          <ArtistBio>{mockArtist.bio}</ArtistBio>
          <ArtistStats>
            <StatItem>
              <StatValue>{mockArtist.followers.toLocaleString()}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{mockArtist.monthlyListeners.toLocaleString()}</StatValue>
              <StatLabel>Monthly Listeners</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{mockArtist.topTracks.length}</StatValue>
              <StatLabel>Tracks</StatLabel>
            </StatItem>
          </ArtistStats>
        </ArtistInfo>
      </ArtistHeader>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'tracks'} 
          onClick={() => setActiveTab('tracks')}
        >
          Tracks
        </Tab>
        <Tab 
          active={activeTab === 'albums'} 
          onClick={() => setActiveTab('albums')}
        >
          Albums
        </Tab>
        <Tab 
          active={activeTab === 'related'} 
          onClick={() => setActiveTab('related')}
        >
          Related Artists
        </Tab>
      </TabContainer>
      
      {activeTab === 'tracks' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
          <h2>Popular Tracks</h2>
          <div>
            <IconButton 
              onClick={() => setViewMode('grid')}
              style={{ color: viewMode === 'grid' ? theme.colors.primary.main : theme.colors.text.secondary }}
            >
              <Icon name="grid" />
            </IconButton>
            <IconButton 
              onClick={() => setViewMode('list')}
              style={{ color: viewMode === 'list' ? theme.colors.primary.main : theme.colors.text.secondary }}
            >
              <Icon name="list" />
            </IconButton>
          </div>
        </div>
      )}
      
      {renderContent()}
    </ArtistContainer>
  );
};

export default Artist; 