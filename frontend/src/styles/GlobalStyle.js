import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    background-color: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .card {
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    transition: ${({ theme }) => theme.transitions.default};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.background.hover};
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    transition: ${({ theme }) => theme.transitions.default};
    
    &-primary {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      
      &:hover {
        opacity: 0.9;
      }
    }
    
    &-secondary {
      background-color: ${({ theme }) => theme.colors.secondary};
      color: white;
      
      &:hover {
        opacity: 0.9;
      }
    }
    
    &-outline {
      border: 1px solid ${({ theme }) => theme.colors.border.light};
      
      &:hover {
        background-color: ${({ theme }) => theme.colors.background.hover};
      }
    }
  }

  .form-group {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    label {
      display: block;
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.text.secondary};
    }
    
    input, textarea, select {
      width: 100%;
      padding: 0.5rem;
      background-color: ${({ theme }) => theme.colors.background.card};
      border: 1px solid ${({ theme }) => theme.colors.border.default};
      border-radius: ${({ theme }) => theme.borderRadius.md};
      transition: ${({ theme }) => theme.transitions.default};
      
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

export default GlobalStyle; 