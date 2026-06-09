import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  currentResume: null,
  userResumes: [],
  experienceType: null,
  selectedTemplate: null,
  currentStep: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  saveStatus: 'idle',
};

export const saveResume = createAsyncThunk(
  'resume/save',
  async (resumeData, thunkAPI) => {
    try {
      const response = await api.post('/resumes', resumeData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, resumeData }, thunkAPI) => {
    try {
      const response = await api.put(`/resumes/${id}`, resumeData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserResumes = createAsyncThunk(
  'resume/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/resumes');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getResumeById = createAsyncThunk(
  'resume/getById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/resumes/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
      localStorage.setItem('currentResume', JSON.stringify(action.payload));
    },
    setExperienceType: (state, action) => {
      state.experienceType = action.payload;
      localStorage.setItem('experienceType', action.payload);
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
      localStorage.setItem('selectedTemplate', JSON.stringify(action.payload));
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
      localStorage.setItem('currentStep', action.payload);
    },
    updateFormData: (state, action) => {
      if (state.currentResume) {
        state.currentResume.formData = {
          ...state.currentResume.formData,
          ...action.payload
        };
      } else {
        state.currentResume = {
          formData: action.payload
        };
      }
      localStorage.setItem('currentResume', JSON.stringify(state.currentResume));
    },
    clearResumeState: (state) => {
      state.currentResume = null;
      state.experienceType = null;
      state.selectedTemplate = null;
      state.currentStep = 1;
      state.saveStatus = 'idle';
      localStorage.removeItem('currentResume');
      localStorage.removeItem('experienceType');
      localStorage.removeItem('selectedTemplate');
      localStorage.removeItem('currentStep');
    },
    loadFromLocalStorage: (state) => {
      const savedResume = localStorage.getItem('currentResume');
      const savedExperienceType = localStorage.getItem('experienceType');
      const savedTemplate = localStorage.getItem('selectedTemplate');
      const savedStep = localStorage.getItem('currentStep');
      
      if (savedResume) {
        try {
          state.currentResume = JSON.parse(savedResume);
        } catch (e) {
          console.error('Error parsing saved resume:', e);
        }
      }
      if (savedExperienceType) state.experienceType = savedExperienceType;
      if (savedTemplate) {
        try {
          state.selectedTemplate = JSON.parse(savedTemplate);
        } catch (e) {
          console.error('Error parsing saved template:', e);
        }
      }
      if (savedStep) state.currentStep = parseInt(savedStep);
    },
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
    resetError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Resume
      .addCase(saveResume.pending, (state) => {
        state.isLoading = true;
        state.saveStatus = 'saving';
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saveStatus = 'saved';
        // Handle both response structures
        state.currentResume = action.payload.data || action.payload;
        localStorage.setItem('currentResume', JSON.stringify(state.currentResume));
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.saveStatus = 'error';
        state.message = action.payload;
      })
      
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.saveStatus = 'saving';
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saveStatus = 'saved';
        // Handle both response structures
        state.currentResume = action.payload.data || action.payload;
        localStorage.setItem('currentResume', JSON.stringify(state.currentResume));
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.saveStatus = 'error';
        state.message = action.payload;
      })
      
      // Get User Resumes
      .addCase(getUserResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userResumes = action.payload.data || action.payload;
      })
      .addCase(getUserResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Resume By ID
      .addCase(getResumeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload.data || action.payload;
        localStorage.setItem('currentResume', JSON.stringify(state.currentResume));
      })
      .addCase(getResumeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete Resume
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userResumes = state.userResumes.filter(resume => resume._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
          localStorage.removeItem('currentResume');
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { 
  setCurrentResume, 
  setExperienceType, 
  setSelectedTemplate, 
  setCurrentStep,
  updateFormData,
  clearResumeState,
  loadFromLocalStorage,
  resetSuccess,
  resetError,
} = resumeSlice.actions;

export default resumeSlice.reducer;