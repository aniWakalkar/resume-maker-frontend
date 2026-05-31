import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk(
  'auth/google',
  async (credential, thunkAPI) => {
    try {
      const response = await api.post('/auth/google', { token: credential });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout - Clear all localStorage and state
export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear all localStorage items
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('rememberedEmail');
  
  // Optional: Call logout API if your backend has one
  // await api.post('/auth/logout');
  
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedEmail');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isError = true;
        state.message = 'Logout failed';
      });
  },
});

export const { reset, clearUser } = authSlice.actions;
export default authSlice.reducer;