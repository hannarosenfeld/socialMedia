import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import session from './session';
import userReducer from './user';
import roomReducer from './room';

export default configureStore({
  reducer: {
    session,
    user: userReducer,
    room: roomReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})