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
import { setUser, removeUser } from './store/session'; // Import session actions
import { getUserData } from './services/userService'; // Import the getUserData function

function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user); // Get sessionUser from Redux store
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User signed in:", user);
        // Fetch additional user data from Firestore
        const userData = await getUserData(user.uid); // Use user.uid to fetch additional data
        console.log("😤", userData)
        if (userData) {
          dispatch(setUser({ ...user, ...userData })); // Merge Firebase user with additional data
        } else {
          dispatch(setUser(user)); // If no additional data, just set the auth user
        }
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
  const formattedUsername = sessionUser ? sessionUser.username.replace(/\s+/g, '-') : 'Guest';

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
            <Route path="/users/:username" element={<ProfilePage />} /> 
            <Route path="/settings/profile" element={<EditProfile />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
