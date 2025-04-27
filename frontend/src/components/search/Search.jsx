import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { theme } from '../../styles/theme';
import { addToQueue, setCurrentTrack } from '../../store/slices/playerSlice';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background-color: ${theme.colors.background.elevated};
  border-radius: ${theme.borderRadius.pill};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  transition: all ${theme.transitions.duration.standard}ms;

  &:focus-within {
    background-color: ${theme.colors.background.paper};
    box-shadow: ${theme.shadows.medium};
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Input = styled.input`
  flex: 1;
  background: none;
  border: none;
  font-size: ${theme.typography.body1.fontSize};
  color: ${theme.colors.text.primary};
  padding: 0;
  margin: 0;
  outline: none;

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity ${theme.transitions.duration.standard}ms;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100% + ${theme.spacing.sm});
  left: 0;
  right: 0;
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.large};
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.visible ? 'block' : 'none'};

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

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: background-color ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }
`;

const Cover = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.sm};
  object-fit: cover;
`;

const TrackInfo = styled.div`
  flex: 1;
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

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    background-color: ${theme.colors.background.default};
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Mock data for demonstration - replace with actual API call
const mockSearch = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockTracks = [
    {
      id: '1',
      title: 'Summer Breeze',
      artist: 'Coastal Waves',
      cover: 'https://picsum.photos/200?random=1',
      url: 'path/to/audio1.mp3'
    },
    {
      id: '2',
      title: 'Mountain Echo',
      artist: 'Nature Sounds',
      cover: 'https://picsum.photos/200?random=2',
      url: 'path/to/audio2.mp3'
    },
    {
      id: '3',
      title: 'City Lights',
      artist: 'Urban Beat',
      cover: 'https://picsum.photos/200?random=3',
      url: 'path/to/audio3.mp3'
    },
    {
      id: '4',
      title: 'Ocean Waves',
      artist: 'Sea Sounds',
      cover: 'https://picsum.photos/200?random=4',
      url: 'path/to/audio4.mp3'
    },
    {
      id: '5',
      title: 'Forest Rain',
      artist: 'Nature Ambient',
      cover: 'https://picsum.photos/200?random=5',
      url: 'path/to/audio5.mp3'
    }
  ];

  return mockTracks.filter(track =>
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  );
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTracks = async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const searchResults = await mockSearch(query);
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchTracks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleAddToQueue = (track, event) => {
    event.stopPropagation();
    dispatch(addToQueue(track));
  };

  const handlePlayNow = (track, event) => {
    event.stopPropagation();
    dispatch(setCurrentTrack(track));
  };

  return (
    <Container ref={containerRef}>
      <SearchBar>
        <SearchIcon>
          <MagnifyingGlassIcon />
        </SearchIcon>
        <Input
          type="text"
          placeholder="Search for songs, artists, or albums"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <ClearButton
          visible={query.length > 0}
          onClick={handleClear}
        >
          <XMarkIcon />
        </ClearButton>
      </SearchBar>

      <ResultsContainer visible={showResults && results.length > 0}>
        {results.map(track => (
          <ResultItem key={track.id}>
            <Cover src={track.cover} alt={track.title} />
            <TrackInfo>
              <Title>{track.title}</Title>
              <Artist>{track.artist}</Artist>
            </TrackInfo>
            <Actions>
              <IconButton onClick={(e) => handlePlayNow(track, e)} title="Play Now">
                <PlayIcon />
              </IconButton>
              <IconButton onClick={(e) => handleAddToQueue(track, e)} title="Add to Queue">
                <PlusIcon />
              </IconButton>
            </Actions>
          </ResultItem>
        ))}
      </ResultsContainer>
    </Container>
  );
};

export default Search; 