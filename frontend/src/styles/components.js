import styled from 'styled-components';
import { theme } from './theme';

export const Button = styled.button`
  background-color: ${props => 
    props.variant === 'outlined' ? 'transparent' : 
    props.variant === 'secondary' ? theme.colors.secondary.main :
    theme.colors.primary.main};
  color: ${props => 
    props.variant === 'outlined' ? theme.colors.primary.main :
    theme.colors.primary.contrastText};
  border: ${props => 
    props.variant === 'outlined' ? `2px solid ${theme.colors.primary.main}` : 'none'};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover {
    background-color: ${props => 
      props.variant === 'outlined' ? theme.colors.primary.light + '20' :
      props.variant === 'secondary' ? theme.colors.secondary.dark :
      theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

export const Card = styled.div`
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.accent.light};
  transition: transform ${theme.transitions.duration.standard}ms, 
              box-shadow ${theme.transitions.duration.standard}ms;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.accent.main};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.body1.fontSize};
  transition: all ${theme.transitions.duration.standard}ms;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.light}33;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.accent.main};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.body1.fontSize};
  min-height: 100px;
  resize: vertical;
  transition: all ${theme.transitions.duration.standard}ms;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${theme.colors.primary.light}33;
  }
`;

export const Badge = styled.span`
  background-color: ${theme.colors.primary.light};
  color: ${theme.colors.primary.dark};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.body2.fontSize};
  font-weight: 500;
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PurpleBox = styled.div`
  background-color: ${theme.colors.accent.light};
  border: 1px solid ${theme.colors.primary.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
`;

export const GradientBox = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  color: ${theme.colors.primary.contrastText};
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary.main};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.duration.standard}ms;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.primary.light}20;
    transform: scale(1.1);
  }

  &:disabled {
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`; 