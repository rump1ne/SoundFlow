import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  Bars3Icon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import {
  setCurrentPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeTrackFromPlaylist,
  reorderPlaylistTracks,
} from '../store/slices/playlistsSlice';
import { setCurrentTrack, togglePlay } from '../store/slices/playerSlice';
import SearchDialog from '../components/search/SearchDialog';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CoverArt = styled.div`
  width: 232px;
  height: 232px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PlaylistType = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Title = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: scale(1.04);
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: none;
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    transform: scale(1.04);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const TracksContainer = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const TracksHeader = styled.div`
  display: grid;
  grid-template-columns: 24px 48px 6fr 4fr 3fr minmax(120px, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DragHandle = styled(Bars3Icon)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: grab;
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 24px 48px 6fr 4fr 3fr minmax(120px, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  align-items: center;
  cursor: pointer;
  user-select: none;
  background-color: ${({ isDragging, theme }) => isDragging ? theme.colors.background.paper : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};

    ${DragHandle} {
      opacity: 1;
    }
  }

  ${({ isPlaying, theme }) => isPlaying && `
    background-color: ${theme.colors.primary}20 !important;
    color: ${theme.colors.primary};
  `}
`;

const TrackNumber = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-variant-numeric: tabular-nums;
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

const TrackAlbum = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackDuration = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-variant-numeric: tabular-nums;
`;

const EditDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.overlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const DialogTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  ${({ primary, theme }) => primary ? `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.primary};
    border: none;

    &:hover {
      background-color: ${theme.colors.primary}dd;
    }
  ` : ({ danger, theme }) => danger ? `
    background-color: ${theme.colors.error};
    color: ${theme.colors.text.primary};
    border: none;

    &:hover {
      background-color: ${theme.colors.error}dd;
    }
  ` : `
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.default};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.hover};
    }
  `}
`;

const AddTracksButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: ${({ theme }) => theme.spacing.md};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlaylistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const playlist = useSelector(state => state.playlists.playlists.find(p => p.id === id));
  const currentTrack = useSelector(state => state.player.currentTrack);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  useEffect(() => {
    if (playlist) {
      dispatch(setCurrentPlaylist(playlist));
    }
  }, [dispatch, playlist]);

  useEffect(() => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDescription(playlist.description);
    }
  }, [playlist]);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  const handlePlayPause = () => {
    if (!playlist.tracks.length) return;
    
    if (!currentTrack || currentTrack.playlistId !== playlist.id) {
      dispatch(setCurrentTrack({ ...playlist.tracks[0], playlistId: playlist.id }));
    } else {
      dispatch(togglePlay());
    }
  };

  const handleTrackClick = (track) => {
    dispatch(setCurrentTrack({ ...track, playlistId: playlist.id }));
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleCloseEdit = () => {
    setShowEditDialog(false);
    setEditName(playlist.name);
    setEditDescription(playlist.description);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      dispatch(updatePlaylist({
        id: playlist.id,
        name: editName.trim(),
        description: editDescription.trim(),
      }));
      setShowEditDialog(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      dispatch(deletePlaylist(playlist.id));
      // TODO: Navigate back to playlists page
    }
  };

  const handleRemoveTrack = (trackId) => {
    dispatch(removeTrackFromPlaylist({ playlistId: playlist.id, trackId }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    dispatch(reorderPlaylistTracks({
      playlistId: playlist.id,
      sourceIndex,
      targetIndex: destinationIndex,
    }));
  };

  const handleOpenSearch = () => {
    setShowSearchDialog(true);
  };

  const handleCloseSearch = () => {
    setShowSearchDialog(false);
  };

  return (
    <Container>
      <Header>
        <CoverArt>
          <img src={playlist.coverUrl} alt={playlist.name} />
        </CoverArt>
        <Info>
          <PlaylistType>Playlist</PlaylistType>
          <Title>{playlist.name}</Title>
          <Description>{playlist.description}</Description>
          <Meta>
            <span>Created by You</span>
            •
            <span>{playlist.tracks.length} songs</span>
          </Meta>
        </Info>
      </Header>

      <Controls>
        <PlayButton onClick={handlePlayPause}>
          {isPlaying && currentTrack?.playlistId === playlist.id ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </PlayButton>
        <IconButton onClick={handleEdit}>
          <PencilIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <TrashIcon />
        </IconButton>
        <AddTracksButton onClick={handleOpenSearch}>
          <PlusIcon />
          Add tracks
        </AddTracksButton>
      </Controls>

      <TracksContainer>
        <TracksHeader>
          <span></span>
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date Added</span>
          <span>
            <ClockIcon style={{ width: 20, height: 20 }} />
          </span>
        </TracksHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tracks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {playlist.tracks.map((track, index) => (
                  <Draggable
                    key={track.id}
                    draggableId={track.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TrackItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        isDragging={snapshot.isDragging}
                        isPlaying={currentTrack?.id === track.id}
                      >
                        <div {...provided.dragHandleProps}>
                          <DragHandle />
                        </div>
                        <TrackNumber>{index + 1}</TrackNumber>
                        <TrackInfo onClick={() => handleTrackClick(track)}>
                          <TrackCover src={track.cover} alt={track.title} />
                          <TrackMeta>
                            <TrackTitle>{track.title}</TrackTitle>
                            <TrackArtist>{track.artist}</TrackArtist>
                          </TrackMeta>
                        </TrackInfo>
                        <TrackAlbum>{track.album}</TrackAlbum>
                        <span>{new Date(track.addedAt).toLocaleDateString()}</span>
                        <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
                      </TrackItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </TracksContainer>

      {showEditDialog && (
        <>
          <Overlay onClick={handleCloseEdit} />
          <EditDialog>
            <DialogTitle>Edit Playlist</DialogTitle>
            <Input
              type="text"
              placeholder="Playlist name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
            />
            <TextArea
              placeholder="Playlist description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <ButtonGroup>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button primary onClick={handleSaveEdit}>Save</Button>
            </ButtonGroup>
          </EditDialog>
        </>
      )}

      {showSearchDialog && (
        <SearchDialog
          playlistId={playlist.id}
          onClose={handleCloseSearch}
        />
      )}
    </Container>
  );
};

export default PlaylistDetail; 