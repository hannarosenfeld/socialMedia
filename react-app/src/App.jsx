import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'; 
import { auth } from './firebase.config'; // Import the auth from your Firebase config
import { onAuthStateChanged } from "firebase/auth"; // Import the function to check auth state

import SignUpPage from './components/SignUpPage.jsx';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Room from './components/Room';

function App() {  
  const [sessionUser, setSessionUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Monitor authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User signed in:", user); // Log user details
        setSessionUser(user); // Set the session user
      } else {
        // User is signed out
        console.log("No user is signed in."); // Log when no user is signed in
        setSessionUser(null); // Clear user state
      }
      setIsLoaded(true); // Set loading to false once checked
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Log sessionUser whenever it changes
  useEffect(() => {
    console.log("Session user:", sessionUser);
  }, [sessionUser]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return (
    <>
      {!sessionUser ? (
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
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
