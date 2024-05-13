import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
import { Link } from '@mui/material';

export default function SignUpPage() {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState('')
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
                        label={ userName ? '' : 'Username'}
                        variant="outlined" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        label={ email ? '' : 'Email'}
                        variant="outlined" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <TextField 
                        id="outlined-basic" 
                        label={ password ? '' : 'Password'}
                        variant="outlined" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                        variant="outlined" 
                        type="submit" 
                    >
                        SIGN UP
                    </Button>
                </Box>                
            </form>
        </div>
    );
}
