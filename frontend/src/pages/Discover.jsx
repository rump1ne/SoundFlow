import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import { theme } from '../styles/theme';

const DiscoverContainer = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 1440px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md};
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.sm};

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.background.paper};
    border-radius: ${theme.borderRadius.full};
  }
`;

const Tab = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background-color: ${props => 
    props.active ? theme.colors.primary.main : theme.colors.background.paper};
  color: ${props => 
    props.active ? theme.colors.primary.contrastText : theme.colors.text.primary};
  font-size: ${theme.typography.button.fontSize};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;
  white-space: nowrap;

  &:hover {
    background-color: ${props => 
      props.active ? theme.colors.primary.dark : theme.colors.background.elevated};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.h5.fontSize};
  font-weight: ${theme.typography.h5.fontWeight};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

// Mock data
const categories = [
  'All', 'Hip Hop', 'Electronic', 'Rock', 'Pop', 'Jazz', 'Classical', 'R&B', 'Latin',
];

const mockPlaylists = [
  {
    id: '1',
    title: 'Hip Hop Hits',
    description: 'Latest trending hip hop tracks',
    cover: 'https://picsum.photos/400?random=10',
    collaborators: [],
  },
  {
    id: '2',
    title: 'Electronic Vibes',
    description: 'Best electronic music selection',
    cover: 'https://picsum.photos/400?random=11',
    collaborators: [],
  },
  {
    id: '3',
    title: 'Rock Classics',
    description: 'Timeless rock anthems',
    cover: 'https://picsum.photos/400?random=12',
    collaborators: [],
  },
  {
    id: '4',
    title: 'Pop Party',
    description: 'Top pop hits for your party',
    cover: 'https://picsum.photos/400?random=13',
    collaborators: [],
  },
];

const mockTracks = [
  {
    id: '1',
    title: 'Urban Beat',
    artist: 'City Rhythm',
    cover: 'https://picsum.photos/60?random=14',
    duration: 195,
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Synth Wave',
    cover: 'https://picsum.photos/60?random=15',
    duration: 210,
  },
  {
    id: '3',
    title: 'Rock Revolution',
    artist: 'Guitar Heroes',
    cover: 'https://picsum.photos/60?random=16',
    duration: 242,
  },
  {
    id: '4',
    title: 'Pop Paradise',
    artist: 'Melody Makers',
    cover: 'https://picsum.photos/60?random=17',
    duration: 198,
  },
];

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { currentTrack, isPlaying } = useSelector((state) => state.player);

  return (
    <DiscoverContainer>
      <Header>
        <Title>Discover</Title>
        <CategoryTabs>
          {categories.map((category) => (
            <Tab
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Tab>
          ))}
        </CategoryTabs>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>Trending Now</SectionTitle>
        </SectionHeader>
        <Grid>
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>New Releases</SectionTitle>
        </SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {mockTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              isCurrentTrack={currentTrack?.id === track.id}
            />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Popular in {activeCategory}</SectionTitle>
        </SectionHeader>
        <Grid>
          {mockPlaylists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </Grid>
      </Section>
    </DiscoverContainer>
  );
};

export default Discover; 