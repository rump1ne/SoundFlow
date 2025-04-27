import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import GlobalStyles from '../../styles/globalStyles';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSelector } from 'react-redux';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.default};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  margin-left: ${props => props.$isMobile ? '0' : '240px'}; // Width of sidebar
  margin-top: 64px; // Height of navbar
  background-color: ${props => props.theme.colors.background.paper};
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

const PlayerOffset = styled.div`
  height: ${props => props.$isPlayerVisible ? '90px' : '0'};
  transition: height 0.3s ease-in-out;
`;

const Layout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isPlayerVisible = useSelector(state => state.player.currentTrack !== null);

  return (
    <LayoutContainer>
      <GlobalStyles />
      <Navbar />
      <Sidebar />
      <MainContent $isMobile={isMobile}>
        {children}
        <PlayerOffset $isPlayerVisible={isPlayerVisible} />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 