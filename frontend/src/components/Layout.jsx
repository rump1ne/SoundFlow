import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import styled from 'styled-components';
import {
  HomeIcon,
  SparklesIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { theme } from '../styles/theme';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.background.default};
`;

const Header = styled.header`
  background-color: ${theme.colors.background.default};
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.accent.main};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
`;

const SearchBar = styled.input`
  width: 100%;
  background-color: ${theme.colors.background.elevated};
  border: none;
  border-radius: ${theme.borderRadius.full};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.body2.fontSize};

  &:focus {
    outline: none;
    background-color: ${theme.colors.background.paper};
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  background-color: ${theme.colors.background.default};
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: ${theme.colors.background.default};
  padding: ${theme.spacing.lg};
  border-right: 1px solid ${theme.colors.accent.main};
  height: calc(100vh - 64px); // Adjusted for new header height
  overflow-y: auto;
`;

const Logo = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h4.fontSize};
  font-weight: ${theme.typography.h4.fontWeight};
  margin-bottom: ${theme.spacing.xl};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.duration.standard}ms;
  font-size: ${theme.typography.body2.fontSize};

  &:hover {
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.elevated};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${theme.spacing.xl};
  overflow-y: auto;
  height: calc(100vh - 64px); // Adjusted for new header height
  background-color: ${theme.colors.background.default};
`;

const ProfileMenu = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
  transition: all ${theme.transitions.duration.standard}ms;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.elevated};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.background.elevated};
  border: 1px solid ${theme.colors.accent.main};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  min-width: 200px;
  margin-top: ${theme.spacing.xs};
  overflow: hidden;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  text-decoration: none;
  transition: background-color ${theme.transitions.duration.standard}ms;
  font-size: ${theme.typography.body2.fontSize};

  &:hover {
    background-color: ${theme.colors.background.paper};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Layout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Header>
        <SearchContainer>
          <SearchBar type="search" placeholder="Search for songs, artists, or playlists" />
        </SearchContainer>
        <ProfileMenu>
          <ProfileButton onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <UserCircleIcon />
          </ProfileButton>
          {isProfileMenuOpen && (
            <MenuDropdown>
              <MenuItem to="/profile">
                <UserCircleIcon />
                Profile
              </MenuItem>
              <MenuItem to="/settings">
                <Cog6ToothIcon />
                Settings
              </MenuItem>
              <MenuItem as="button" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon />
                Logout
              </MenuItem>
            </MenuDropdown>
          )}
        </ProfileMenu>
      </Header>

      <MainContent>
        <Sidebar>
          <Logo>SoundFlow</Logo>
          <Nav>
            <NavLink to="/">
              <HomeIcon />
              Home
            </NavLink>
            <NavLink to="/whats-new">
              <SparklesIcon />
              What's New
            </NavLink>
          </Nav>
        </Sidebar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 