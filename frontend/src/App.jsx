import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import LikedSongs from './pages/LikedSongs';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Player from './components/player/Player';
import { useSelector } from 'react-redux';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  background-color: ${({ theme }) => theme.colors.background.navbar};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Username = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  padding-bottom: calc(90px + 2rem); /* Add padding for the player */
`;

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <AppContainer>
        <Navbar>
          <NavContent>
            <Logo to="/">
              <span>🎵</span>
              SoundFlow
            </Logo>
            <NavLinks>
              {isAuthenticated ? (
                <>
                  <NavLink to="/search">Search</NavLink>
                  <NavLink to="/library">Library</NavLink>
                  <NavLink to="/liked-songs">Liked Songs</NavLink>
                  <UserInfo>
                    <NavLink to="/settings">Settings</NavLink>
                    <Username>{user?.username}</Username>
                  </UserInfo>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </NavLinks>
          </NavContent>
        </Navbar>
        <MainContent>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Library />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlist/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaylistDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked-songs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LikedSongs />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainContent>
        <Player />
      </AppContainer>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
