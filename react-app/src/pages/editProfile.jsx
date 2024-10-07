import { useState, useEffect } from 'react';
import { Avatar, TextField, Button, Typography, Box } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { editUserThunk } from '../store/user.js'; 

const EditProfileForm = () => {
  const dispatch = useDispatch();
  
  // Fetch sessionUser from the Redux store
  const sessionUser = useSelector((state) => state.session.user);

  // If sessionUser is not available, return early
  if (!sessionUser) {
    return <Typography variant="h6">Loading user data...</Typography>;
  }

  // Extract user data from sessionUser
  const userId = sessionUser.uid;
  const [username, setUsername] = useState(sessionUser.username || '');
  const [color, setColor] = useState(sessionUser.color || '#000000');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare updated user data
    const updatedData = { username, color };

    // Dispatch the editUserThunk to update Firebase and session state
    dispatch(editUserThunk(sessionUser, updatedData));
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
        {/* Display user's avatar */}
        <Avatar
          sx={{
            bgcolor: deepPurple[500],
            width: 100,
            height: 100,
            fontSize: 50,
          }}
        >
          {sessionUser.username[0].toUpperCase()}
        </Avatar>

        {/* Edit Profile Title */}
        <Typography variant="h5">Edit Profile</Typography>

        {/* Username field */}
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          InputLabelProps={{
            shrink: !!username, // Ensure label shrinks if there's text
          }}
        />

        {/* Color picker */}
        <TextField
          label="Color"
          variant="outlined"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          fullWidth
        />

        {/* Submit button */}
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </Box>
    </div>
  );
};

export default EditProfileForm;
