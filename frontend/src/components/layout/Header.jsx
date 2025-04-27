import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { theme } from '../../styles/theme';
import Search from '../search/Search';

const Container = styled.header`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background.paper};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${theme.colors.background.default};
  border: none;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }

  &:disabled {
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
    background-color: ${theme.colors.background.default};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.pill};
  background-color: ${theme.colors.background.default};
  border: none;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;

  &:hover {
    background-color: ${theme.colors.background.elevated};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const UserName = styled.span`
  font-size: ${theme.typography.body2.fontSize};
  font-weight: 500;
`;

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleUserClick = () => {
    navigate('/profile');
  };

  return (
    <Container>
      <NavigationButtons>
        <NavButton onClick={handleBack}>
          <ChevronLeftIcon />
        </NavButton>
        <NavButton onClick={handleForward}>
          <ChevronRightIcon />
        </NavButton>
      </NavigationButtons>

      <Search />

      <UserSection>
        <UserButton onClick={handleUserClick}>
          <UserCircleIcon />
          <UserName>John Doe</UserName>
        </UserButton>
      </UserSection>
    </Container>
  );
};

export default Header; 