import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setLoading } = authSlice.actions;

// Thunk to restore user session
export const restoreSession = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(setLoading(false));
    return;
  }

  try {
    const response = await authAPI.getCurrentUser();
    if (response.data.success) {
      dispatch(setUser(response.data.user));
    } else {
      dispatch(logout());
    }
  } catch (error) {
    dispatch(logout());
  }
};

export default authSlice.reducer; 