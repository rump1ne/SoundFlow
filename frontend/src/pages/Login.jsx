import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #b3b3b3;
  font-size: 1rem;
  margin-bottom: 32px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 12px 16px;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #1db954;
  }

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  background: #1db954;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1ed760;
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 16px;
`;

const LinkText = styled.p`
  color: #b3b3b3;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 24px;

  a {
    color: #1db954;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.data.user,
          token: response.data.data.token
        }));
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      dispatch(loginFailure(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to SoundFlow</Title>
        <Subtitle>Sign in to continue</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LinkText>
          Don't have an account? <Link to="/register">Sign up</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 