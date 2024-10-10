import { useState } from 'react';
import { Avatar, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { editUserThunk } from '../store/user.js'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import AddIcon from '@mui/icons-material/Add';

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
  const [profilePic, setProfilePic] = useState(sessionUser.profilePic || ''); // URL for profile pic
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    let profilePicUrl = profilePic;

    // If a new file is selected, upload it to Firebase Storage
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile-pics/${userId}`);
      await uploadBytes(storageRef, selectedFile);
      profilePicUrl = await getDownloadURL(storageRef); // Get the URL after upload
    }

    // Prepare updated user data
    const updatedData = { username, color, profilePic: profilePicUrl };

    // Dispatch the editUserThunk to update Redux state
    dispatch(editUserThunk(sessionUser, updatedData));

    // Update Firestore user document with the new profile picture URL
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId); // Assuming Firestore user data is stored under 'users/{userId}'

    try {
      await updateDoc(userDocRef, {
        username,
        color,
        profilePic: profilePicUrl, // Update profile picture URL in Firestore
      });
      console.log('User profile updated successfully in Firestore!');
    } catch (error) {
      console.error('Error updating profile in Firestore:', error);
    }
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
        {/* Display user's avatar with upload icon */}
        <Box
          sx={{
            position: 'relative', // Allows for absolute positioning of the icon
            display: 'inline-block',
          }}
        >
          {/* Avatar */}
          <Avatar
            src={profilePic || undefined} // Show profile picture if available
            sx={{
              bgcolor: profilePic ? 'transparent' : deepPurple[500], // Remove bgcolor if image is uploaded
              width: 100,
              height: 100,
              fontSize: 50,
            }}
          >
            {!profilePic && sessionUser.username[0].toUpperCase()}
          </Avatar>

          {/* Plus icon for upload */}
          <IconButton
            component="label" // Allows file input via the button
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: 1,
              '&:hover': {
                backgroundColor: 'lightgray',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </IconButton>
        </Box>

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
