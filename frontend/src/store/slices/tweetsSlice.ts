import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetsApi } from '../../services/api';
import type { Tweet, CreateTweetData } from '../../types';

interface TweetsState {
  myTweets: Tweet[];
  sharedTweets: Tweet[];
  loading: boolean;
  error: string | null;
}

const initialState: TweetsState = {
  myTweets: [],
  sharedTweets: [],
  loading: false,
  error: null,
};

export const createTweet = createAsyncThunk(
  'tweets/create',
  async (data: CreateTweetData, { rejectWithValue }) => {
    try {
      const response = await tweetsApi.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tweet');
    }
  },
);

export const fetchMyTweets = createAsyncThunk(
  'tweets/fetchMyTweets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tweetsApi.getMyTweets();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tweets');
    }
  },
);

export const fetchSharedTweets = createAsyncThunk(
  'tweets/fetchSharedTweets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tweetsApi.getSharedWithMe();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shared tweets');
    }
  },
);

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Tweet
    builder.addCase(createTweet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTweet.fulfilled, (state, action) => {
      state.loading = false;
      state.myTweets.unshift(action.payload);
    });
    builder.addCase(createTweet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch My Tweets
    builder.addCase(fetchMyTweets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyTweets.fulfilled, (state, action) => {
      state.loading = false;
      state.myTweets = action.payload;
    });
    builder.addCase(fetchMyTweets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Shared Tweets
    builder.addCase(fetchSharedTweets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSharedTweets.fulfilled, (state, action) => {
      state.loading = false;
      state.sharedTweets = action.payload;
    });
    builder.addCase(fetchSharedTweets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = tweetsSlice.actions;
export default tweetsSlice.reducer;
