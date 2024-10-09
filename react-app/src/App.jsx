import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'; 
import { auth } from './firebase/firebase.config.js';
import { onAuthStateChanged } from "firebase/auth";
import NavBar from './components/NavBar/index.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Room from './components/Room';
import ProfilePage from './pages/userProfile.jsx';
import EditProfile from './pages/editProfile.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, removeUser } from './store/session';
import { getUserData } from './services/userService';
import { getAllRoomsThunk } from './store/room.js';
import './styles/globals.css';



function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roomsLoaded, setRoomsLoaded] = useState(false);  // Add state to track room loading

  useEffect(() => {
    const fetchRooms = async () => {
      if (sessionUser) {
        await dispatch(getAllRoomsThunk());
        setRoomsLoaded(true); // Rooms are loaded
      }
    };
    fetchRooms();
  }, [dispatch, sessionUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          dispatch(setUser({ ...user, ...userData }));
        } else {
          dispatch(setUser(user));
        }
      } else {
        dispatch(removeUser());
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Show loading screen until both user and rooms are loaded
  if (!isLoaded || !roomsLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <NavBar sessionUser={sessionUser} />
      <Routes>
        {!sessionUser ? (
          <>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/signup" element={<SignUpPage />} />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Dashboard sessionUser={sessionUser} />} />    
            <Route path="/rooms/:roomName" element={<Room sessionUser={sessionUser} />} />
            <Route path="/users/:username" element={<ProfilePage sessionUser={sessionUser}/>} /> 
            <Route path="/settings/profile" element={<EditProfile sessionUser={sessionUser}/>} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
