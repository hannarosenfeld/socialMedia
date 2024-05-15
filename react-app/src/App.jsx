import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from './store/user';
import { setUser } from './store/session';
import { CssBaseline, ThemeProvider } from '@mui/material';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom'; 
import { authenticate } from "./store/session";
import './App.css';
import SignUpPage from './components/SIgnUpPage';
import Room from './components/Room';
import { getAllRoomsThunk } from './store/room'


function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllRoomsThunk());
  }, [dispatch])

  useEffect(() => {
    dispatch(authenticate())
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch]);


  return (
    <>
    {isLoaded && (    
      <>
        {!sessionUser && (
          <Routes>
            <Route exact path="/signup" element={<SignUpPage/>}/>
            <Route excact path="/" element={<LoginPage/>}/>
          </Routes>
        )}
        {sessionUser && (
          <Routes>
            <Route exact path="/" element={<Dashboard />}/>    
            <Route path="/rooms/:roomName" element={<Room />}/>          

          </Routes>
        )}
      </>
    )}
    </>
  )
}

export default App
