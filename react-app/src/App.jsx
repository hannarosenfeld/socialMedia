import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'; 
import { auth } from './firebase/firebase.config.js'; // Import the auth from your Firebase config
import { onAuthStateChanged } from "firebase/auth"; // Import the function to check auth state
// import { login } from "./store/session.js";
import NavBar from './components/NavBar/index.jsx';

import SignUpPage from './components/SignUpPage.jsx';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Room from './components/Room';
import { useDispatch } from 'react-redux';

function App() {  
  const dispatch = useDispatch();
  const [sessionUser, setSessionUser] = useState(null); // Store the entire user object
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user);
        setSessionUser(user); // Store the user object in state
        // dispatch(login(user.email, user.username)); // Example of dispatching user email
      } else {
        console.log("No user is signed in.");
        setSessionUser(null);
      }
      setIsLoaded(true);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Log sessionUser whenever it changes
  useEffect(() => {
    if (sessionUser) {
      console.log("Session user ID:", sessionUser); // Log user ID
      console.log("Session user email:", sessionUser.email); // Log user email
    }
  }, [sessionUser]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional loading indicator
  }

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
            {/* Pass the sessionUser (which contains email or ID) as a prop to Dashboard */}
            <Route path="/" element={<Dashboard sessionUser={sessionUser} />} />    
            <Route path="/rooms/:roomName" element={<Room sessionUser={sessionUser} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
