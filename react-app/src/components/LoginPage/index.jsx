import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={onSubmit}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > :not(style)': { 
                        m: 1, 
                        width: '100%', // Adjust width as needed
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
                    onChange={(e) => setEmail(e.target.value)} // Update state with email input
                />
                <TextField 
                    id="outlined-basic" 
                    label="Password" 
                    variant="outlined" 
                    type="password" // Set input type to password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update state with password input
                />
                <Button 
                    variant="outlined" 
                    type="submit" // Set type to submit for form submission
                >
                    Submit
                </Button>
            </Box>
        </form>
    );
}
