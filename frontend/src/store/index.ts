import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tweetsReducer from './slices/tweetsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
