import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { addTrackToPlaylist } from '../../store/slices/playlistsSlice';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.overlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background.hover};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.default};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const TrackCover = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const TrackMeta = styled.div`
  min-width: 0;
`;

const TrackTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: none;
  color: ${({ added, theme }) => added ? theme.colors.success : theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ added, theme }) => added ? theme.colors.success : theme.colors.primary};
    border-color: ${({ added, theme }) => added ? theme.colors.success : theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 20px;
    height: 20px;
  }
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

// Mock data for demonstration
const mockTracks = [
  {
    id: '101',
    title: 'Summer Breeze',
    artist: 'Coastal Waves',
    album: 'Beach Vibes',
    cover: 'https://picsum.photos/200?random=101',
    duration: 184,
  },
  {
    id: '102',
    title: 'Mountain Echo',
    artist: 'Nature Sounds',
    album: 'Wilderness',
    cover: 'https://picsum.photos/200?random=102',
    duration: 221,
  },
  {
    id: '103',
    title: 'City Lights',
    artist: 'Urban Beat',
    album: 'Midnight Drive',
    cover: 'https://picsum.photos/200?random=103',
    duration: 197,
  },
  // Add more mock tracks as needed
];

const SearchDialog = ({ playlistId, onClose }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addedTracks, setAddedTracks] = useState(new Set());

  useEffect(() => {
    // Simulated search functionality
    if (searchQuery.trim()) {
      const results = mockTracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddTrack = (track) => {
    if (!addedTracks.has(track.id)) {
      dispatch(addTrackToPlaylist({
        playlistId,
        track: {
          ...track,
          addedAt: new Date().toISOString(),
        },
      }));
      setAddedTracks(prev => new Set([...prev, track.id]));
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()}>
        <Header>
          <MagnifyingGlassIcon style={{ width: 24, height: 24, color: theme.colors.text.secondary }} />
          <SearchInput
            type="text"
            placeholder="Search for songs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <CloseButton onClick={onClose}>
            <XMarkIcon />
          </CloseButton>
        </Header>
        <Content>
          {searchResults.length > 0 ? (
            <ResultsList>
              {searchResults.map(track => (
                <TrackItem key={track.id}>
                  <TrackInfo>
                    <TrackCover src={track.cover} alt={track.title} />
                    <TrackMeta>
                      <TrackTitle>{track.title}</TrackTitle>
                      <TrackArtist>{track.artist}</TrackArtist>
                    </TrackMeta>
                  </TrackInfo>
                  <AddButton
                    onClick={() => handleAddTrack(track)}
                    added={addedTracks.has(track.id)}
                  >
                    {addedTracks.has(track.id) ? <CheckIcon /> : <PlusIcon />}
                  </AddButton>
                </TrackItem>
              ))}
            </ResultsList>
          ) : searchQuery ? (
            <EmptyState>
              <p>No results found for "{searchQuery}"</p>
              <p>Try searching for something else</p>
            </EmptyState>
          ) : (
            <EmptyState>
              <p>Start typing to search for tracks</p>
            </EmptyState>
          )}
        </Content>
      </Dialog>
    </Overlay>
  );
};

export default SearchDialog; 