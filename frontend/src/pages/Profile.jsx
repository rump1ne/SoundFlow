import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { PlaylistCard } from '../components/playlist/PlaylistCard';
import { TrackList } from '../components/tracks/TrackList';

const ProfileContainer = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
`;

const ProfileAvatar = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: 4rem;
  font-weight: bold;
  box-shadow: ${theme.shadows.md};
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.text};
  margin: 0;
`;

const ProfileUsername = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const ProfileBio = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.text};
  margin: ${theme.spacing.md} 0;
  line-height: 1.6;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.surfaceAlt};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  min-width: 120px;
`;

const StatValue = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const StatLabel = styled.span`
  font-size: 1rem;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.lg};
`;

const Tab = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: none;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  margin-bottom: -2px;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const playlists = useSelector((state) => state.playlists.playlists);
  const likedSongs = useSelector((state) => state.playlists.likedSongs);
  const recentlyPlayed = useSelector((state) => state.player.recentlyPlayed || []);

  // Mock user data - replace with actual user state when auth is implemented
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Music enthusiast | Playlist curator | Always exploring new sounds',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return playlists.length > 0 ? (
          <Grid>
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </Grid>
        ) : (
          <EmptyState>No playlists created yet</EmptyState>
        );
      case 'liked':
        return likedSongs.length > 0 ? (
          <TrackList tracks={likedSongs} showHeader />
        ) : (
          <EmptyState>No liked songs yet</EmptyState>
        );
      case 'history':
        return recentlyPlayed.length > 0 ? (
          <TrackList tracks={recentlyPlayed} showHeader />
        ) : (
          <EmptyState>No recently played tracks</EmptyState>
        );
      default:
        return null;
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>
          {user.name.charAt(0)}
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{user.name}</ProfileName>
          <ProfileUsername>@{user.username}</ProfileUsername>
          <ProfileBio>{user.bio}</ProfileBio>
          <ProfileStats>
            <StatItem>
              <StatValue>{playlists.length}</StatValue>
              <StatLabel>Playlists</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{likedSongs.length}</StatValue>
              <StatLabel>Liked Songs</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{recentlyPlayed.length}</StatValue>
              <StatLabel>Recently Played</StatLabel>
            </StatItem>
          </ProfileStats>
        </ProfileInfo>
      </ProfileHeader>

      <TabContainer>
        <Tab 
          $active={activeTab === 'playlists'} 
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </Tab>
        <Tab 
          $active={activeTab === 'liked'} 
          onClick={() => setActiveTab('liked')}
        >
          Liked Songs
        </Tab>
        <Tab 
          $active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Recently Played
        </Tab>
      </TabContainer>

      {renderContent()}
    </ProfileContainer>
  );
};

export default Profile; 