import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from './store/user';
import { setUser } from './store/session';
import { CssBaseline, ThemeProvider } from '@mui/material';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';

import './App.css';


function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser) console.log("💖", sessionUser)
  }, [sessionUser])

  return (
    <>
    {!sessionUser && (
      <LoginPage />
    )}
    <div>
    {sessionUser && (
      <div>
        <NavBar />
        <Dashboard />
      </div>
    )}
    </div>
    </>
  )
}

export default App
