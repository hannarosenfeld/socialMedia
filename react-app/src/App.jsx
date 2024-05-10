import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from './store/user';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { setUser } from './store/session';

import './App.css';


function App() {  
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const x = dispatch(getUserThunk(1))
  }, [])

  useEffect(() => {
    // if (sessionUser) console.log("💖", sessionUser)
  }, [sessionUser])

  return (
    <>
    {!sessionUser && (
      <LoginPage />
    )}
    <Dashboard />
    </>
  )
}

export default App
