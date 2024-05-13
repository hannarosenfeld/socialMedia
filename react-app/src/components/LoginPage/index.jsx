import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
import { Link } from 'react-router-dom'; // Import Link instead of NavLink

export default function LoginPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login(email, password));
    };
    
    return (
        <div style={{
            width: "100%", 
            height: "100vh",                   
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', // Align content vertically in the center
            textAlign: 'center', // Align text in the center
            margin: "0 auto"}}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center', // Align content vertically in the center
                        textAlign: 'center', // Align text in the center
                        margin: "0 auto",
                        //border: '2px solid hotpink',
                        '& > :not(style)': {
                            m: 1,
                            width: '100%', // Default width
                        },
                        '@media (min-width: 600px)': {
                            maxWidth: 600, // Max width for desktop
                        },
                        '@media (max-width: 768px)': {
                            width: '90%', // Width for tablets and mobile
                        },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField 
                        id="outlined-basic" 
                        label="Email" 
                        variant="outlined" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Password" 
                        variant="outlined" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                        variant="outlined" 
                        type="submit" 
                    >
                        Submit
                    </Button>
            <Link 
                to="/signup" 
                style={{
                    marginTop: '1em',
                    textDecoration: 'none',
                    color: 'blue',
                }}
            >
                <Button variant="text" color="secondary" style={{marginLeft: "auto", width: "fit-content", display: 'flex', alignItems: 'center'}}>
                <span>Signup here</span>
                <span class="material-symbols-outlined">
                arrow_forward
                </span>
                </Button>
            </Link>
                </Box> 
            </form>
            {/* Use Link instead of NavLink */}
        </div>
    );
}
