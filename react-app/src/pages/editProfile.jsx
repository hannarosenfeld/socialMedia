import { useState, useEffect } from 'react';
import { Avatar, TextField, Button, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { deepPurple } from '@mui/material/colors';
import { saveUserData, getUserData } from '../services/userService.js';

const EditProfileForm = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser.uid; // Assuming the user ID is stored in the session user
    const [username, setUsername] = useState(sessionUser.username);
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        // Load existing user data on component mount
        const loadUserData = async () => {
            const userData = await getUserData(userId);
            if (userData) {
                setUsername(userData.username);
                setColor(userData.color || '#000000'); // Default to black if color is not set
            }
        };
        
        loadUserData();
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prepare user data
        const userData = { username, color };

        // Save the user data to Firebase
        await saveUserData(userId, userData);
        // Optionally, reset the form or provide feedback to the user
        console.log('Changes saved:', userData);
    };

    return (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: 4,
                }}
            >
                <Avatar sx={{ bgcolor: deepPurple[500], width: 100, height: 100, fontSize: 50 }}>
                    {sessionUser.displayName[0]}
                </Avatar>
                <Typography variant="h5">Edit Profile</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Color"
                    variant="outlined"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    fullWidth
                />
                <Button variant="contained" color="primary" type="submit">
                    Save Changes
                </Button>
            </Box>
        </div>
    );
};

export default EditProfileForm;
