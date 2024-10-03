import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom'; 
import { authenticate } from "./store/session";
import { getAllRoomsThunk } from './store/room';

import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Room from './components/Room';

function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllRoomsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(authenticate())
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return (
    <>
      {!sessionUser ? (
        <Routes>
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route exact path="/" element={<LoginPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/" element={<Dashboard />} />    
          <Route path="/rooms/:roomName" element={<Room />} />
        </Routes>
      )}
    </>
  );
}

export default App;
