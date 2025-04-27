import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  HeartIcon,
  PlusCircleIcon,
  FolderIcon,
  BookmarkIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  MusicalNoteIcon as MusicalNoteIconSolid,
  HeartIcon as HeartIconSolid,
  FolderIcon as FolderIconSolid,
} from '@heroicons/react/24/solid';
import { createPlaylist } from '../../store/slices/playlistsSlice';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.navbar};
  border-right: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }
`;

const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 90;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
    transition: opacity 0.3s ease-in-out;
  }
`;

const MobileToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    z-index: 110;
    background: ${({ theme }) => theme.colors.background.navbar};
    border: none;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    color: ${({ theme }) => theme.colors.text.primary};
    cursor: pointer;
    
    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background: ${({ theme }) => theme.colors.background.hover};
    }
  }
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text.primary};
    padding: ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
    
    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const Nav = styled.nav`
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    background-color: ${theme.colors.background.hover};
    font-weight: ${theme.typography.fontWeight.medium};
  `}
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const PlaylistSection = styled.div`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.md};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background.hover};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CreatePlaylistButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  width: 100%;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const PlaylistList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const PlaylistLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const CreatePlaylistDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.background.navbar};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 400px;
  z-index: 1100;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const DialogTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
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
  background-color: ${({ theme }) => theme.colors.background.card};
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
  background-color: ${({ theme }) => theme.colors.background.card};
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

  ${props => props.$primary ? `
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;

    &:hover {
      opacity: 0.9;
    }
  ` : `
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: 1px solid ${({ theme }) => theme.colors.border.default};

    &:hover {
      color: ${({ theme }) => theme.colors.text.primary};
      background-color: ${({ theme }) => theme.colors.background.hover};
    }
  `}
`;

function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const playlists = useSelector((state) => state.playlists.items);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(!isMobileOpen);
  }, [isMobileOpen]);

  const handleCreatePlaylist = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPlaylistName('');
  };

  const handleSubmitPlaylist = () => {
    if (playlistName.trim()) {
      dispatch(createPlaylist({ name: playlistName.trim() }));
      handleCloseDialog();
    }
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setIsMobileOpen(false);
    }
  }, []);

  return (
    <>
      <MobileToggle onClick={toggleMobileSidebar} aria-label="Toggle menu">
        <Bars3Icon />
      </MobileToggle>

      <MobileOverlay $isOpen={isMobileOpen} onClick={handleOverlayClick} />

      <SidebarContainer $isOpen={isMobileOpen}>
        <Logo>
          SoundFlow
          <CloseButton onClick={toggleMobileSidebar} aria-label="Close menu">
            <XMarkIcon />
          </CloseButton>
        </Logo>

        <Nav>
          <NavList>
            <NavItem>
              <NavLink to="/" $isActive={location.pathname === '/'}>
                {location.pathname === '/' ? <HomeIconSolid /> : <HomeIcon />}
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/search" $isActive={location.pathname === '/search'}>
                {location.pathname === '/search' ? (
                  <MagnifyingGlassIconSolid />
                ) : (
                  <MagnifyingGlassIcon />
                )}
                Search
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/library" $isActive={location.pathname === '/library'}>
                {location.pathname === '/library' ? (
                  <MusicalNoteIconSolid />
                ) : (
                  <MusicalNoteIcon />
                )}
                Your Library
              </NavLink>
            </NavItem>
          </NavList>

          <Divider />

          <NavList>
            <NavItem>
              <NavLink to="/liked" $isActive={location.pathname === '/liked'}>
                {location.pathname === '/liked' ? (
                  <HeartIconSolid />
                ) : (
                  <HeartIcon />
                )}
                Liked Songs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/bookmarks"
                $isActive={location.pathname === '/bookmarks'}
              >
                <BookmarkIcon />
                Bookmarks
              </NavLink>
            </NavItem>
          </NavList>
        </Nav>

        <Divider />

        <PlaylistSection>
          <PlaylistHeader>
            <span>Your Playlists</span>
          </PlaylistHeader>
          <CreatePlaylistButton onClick={handleCreatePlaylist}>
            <PlusCircleIcon />
            Create Playlist
          </CreatePlaylistButton>
          <PlaylistList>
            {playlists.map((playlist) => (
              <PlaylistLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                $isActive={location.pathname === `/playlist/${playlist.id}`}
              >
                {playlist.name}
              </PlaylistLink>
            ))}
          </PlaylistList>
        </PlaylistSection>

        {isDialogOpen && (
          <>
            <Overlay onClick={handleCloseDialog} />
            <CreatePlaylistDialog>
              <DialogTitle>Create New Playlist</DialogTitle>
              <Input
                type="text"
                placeholder="Playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                autoFocus
              />
              <ButtonGroup>
                <Button onClick={handleCloseDialog} $variant="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSubmitPlaylist} $variant="primary">
                  Create
                </Button>
              </ButtonGroup>
            </CreatePlaylistDialog>
          </>
        )}
      </SidebarContainer>
    </>
  );
}

export default Sidebar; 