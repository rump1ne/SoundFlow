import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSelector } from 'react-redux';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: ${({ $isMobile }) => ($isMobile ? '0' : '240px')}; // Width of sidebar
  height: 64px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  transition: left 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 480px) {
    display: none;
  }
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 ${({ theme }) => theme.spacing.xl};
  position: relative;

  @media (max-width: 768px) {
    margin: 0 ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    margin: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.paper};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled(NavButton)`
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.xs};
    
    span {
      display: none;
    }
  }
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const user = useSelector(state => state.auth.user);
  const notifications = useSelector(state => state.notifications.unread);

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleNotificationsClick = useCallback(() => {
    navigate('/notifications');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return (
    <NavbarContainer $isMobile={isMobile}>
      <NavigationButtons>
        <NavButton 
          onClick={() => navigate(-1)}
          disabled={!location.key}
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </NavButton>
        <NavButton 
          onClick={() => navigate(1)}
          disabled={!location.key}
          aria-label="Go forward"
        >
          <ChevronRightIcon />
        </NavButton>
      </NavigationButtons>

      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search for songs, artists, or playlists"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
      </SearchContainer>

      <UserSection>
        <IconButton 
          onClick={handleNotificationsClick}
          aria-label="Notifications"
        >
          <BellIcon />
          {notifications.length > 0 && (
            <NotificationBadge>
              {notifications.length > 9 ? '9+' : notifications.length}
            </NotificationBadge>
          )}
        </IconButton>
        <UserButton onClick={handleProfileClick}>
          <UserCircleIcon />
          <UserName>{user?.username || 'Guest'}</UserName>
        </UserButton>
      </UserSection>
    </NavbarContainer>
  );
}

export default Navbar; 