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
import { useDispatch, useSelector } from 'react-redux';
import { setUser, removeUser } from './store/session'; // Import session actions

function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user); // Get sessionUser from Redux store
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user);
        dispatch(setUser(user));  // Dispatch the user to Redux
      } else {
        console.log("No user is signed in.");
        dispatch(removeUser());   // Dispatch removal of user from Redux when signed out
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [dispatch]); // Add dispatch to dependency array

  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  // Format username for URL
  const formattedUsername = sessionUser ? sessionUser.displayName?.replace(/\s+/g, '-') : 'Guest';

  return (
    <>
      <NavBar sessionUser={sessionUser} />
      <Routes>
        {!sessionUser ? (
          <>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<LoginPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard sessionUser={sessionUser} />} />    
            <Route path="/rooms/:roomName" element={<Room sessionUser={sessionUser} />} />
            <Route path="/users/:username" element={<ProfilePage />} /> {/* Updated route */}
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
