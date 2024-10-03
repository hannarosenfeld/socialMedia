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
import { useDispatch } from 'react-redux';

function App() {  
  const dispatch = useDispatch();
  const [sessionUser, setSessionUser] = useState(null); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user);
        setSessionUser(user); 
      } else {
        console.log("No user is signed in.");
        setSessionUser(null);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  // Format username for URL
  const formattedUsername = sessionUser ? sessionUser?.displayName?.replace(/\s+/g, '-') : 'Guest';

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
            <Route path={`/users/${formattedUsername}`} element={<ProfilePage />} /> {/* Updated route */}
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
