import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        // Add your form submission logic here
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
        margin: "0 auto",}}>
        <form onSubmit={onSubmit}>
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
            </Box>
        </form>
        </div>
    );
}
