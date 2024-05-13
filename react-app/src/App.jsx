import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from './store/user';
import { setUser } from './store/session';
import { CssBaseline, ThemeProvider } from '@mui/material';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom'; 

import './App.css';
import SignUpPage from './components/SIgnUpPage';

function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser) console.log("💖", sessionUser)
  }, [sessionUser])

  return (
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
      </Routes>
    )}
    </>
  )
}

export default App
