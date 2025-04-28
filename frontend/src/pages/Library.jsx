import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  HeartIcon,
  ListBulletIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { setTracks, setPlaylists, setLoading, setError } from '../store/slices/contentSlice';
import { fetchTracks, fetchPlaylists } from '../services/api';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1440px;
  margin: 0 auto;
  min-height: calc(100vh - 90px); /* Account for player height */
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => 
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => 
    props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const Library = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const { tracks, playlists, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    const loadContent = async () => {
      dispatch(setLoading(true));
      try {
        const [tracksData, playlistsData] = await Promise.all([
          fetchTracks(),
          fetchPlaylists()
        ]);
        dispatch(setTracks(tracksData));
        dispatch(setPlaylists(playlistsData));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadContent();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTracks = useMemo(() => 
    tracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [tracks, searchQuery]
  );

  const filteredPlaylists = useMemo(() =>
    playlists.filter(playlist =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [playlists, searchQuery]
  );

  const renderContent = () => {
    if (loading) {
      return (
        <EmptyState>
          <h3>Loading...</h3>
        </EmptyState>
      );
    }

    if (error) {
      return (
        <EmptyState>
          <h3>Error loading content</h3>
          <p>{error}</p>
        </EmptyState>
      );
    }

    const items = activeTab === 'playlists' ? filteredPlaylists : filteredTracks;
    const isEmpty = items.length === 0;

    if (isEmpty) {
      return (
        <EmptyState>
          <h3>No {activeTab} found</h3>
          <p>Try adjusting your search or check back later</p>
        </EmptyState>
      );
    }

    return (
      <Grid>
        {items.map(item => (
          activeTab === 'playlists' ? (
            <PlaylistCard key={item.id} playlist={item} />
          ) : (
            <TrackCard key={item.id} track={item} />
          )
        ))}
      </Grid>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Your Library</Title>
        <Controls>
          <SearchBar>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search in your library"
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchBar>
          <FilterButton>
            Recently Added
            <ChevronDownIcon />
          </FilterButton>
        </Controls>
        <Tabs>
          <Tab
            $active={activeTab === 'playlists'}
            onClick={() => setActiveTab('playlists')}
          >
            <ListBulletIcon />
            Playlists
          </Tab>
          <Tab
            $active={activeTab === 'liked'}
            onClick={() => setActiveTab('liked')}
          >
            <HeartIcon />
            Liked Songs
          </Tab>
          <Tab
            $active={activeTab === 'recent'}
            onClick={() => setActiveTab('recent')}
          >
            <ClockIcon />
            Recently Played
          </Tab>
        </Tabs>
      </Header>
      {renderContent()}
    </Container>
  );
};

export default Library; 