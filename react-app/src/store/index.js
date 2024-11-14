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
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    
    // Add logger only in development
    if (process.env.NODE_ENV === 'development') {
      middlewares.push(logger);
    }
    
    return middlewares;
  },
});
