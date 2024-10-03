import { Avatar, Typography, Box, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom'; // Import useParams to access the route params
import { deepPurple } from '@mui/material/colors'; // Optional color for the avatar background

const ProfilePage = () => {
  // Access the username from the URL
  const { username } = useParams(); // This will extract 'username' from the /users/:username route

  // Decode the username (replace hyphens with spaces)
  const decodedUsername = username.replace(/-/g, ' '); // Replace hyphens with spaces

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: 'background.default', padding: 3 }}
    >
      <Box display="flex" alignItems="center">
        {/* User Icon (Avatar) */}
        <Avatar sx={{ bgcolor: deepPurple[500], width: 100, height: 100, fontSize: 50 }}>
          {decodedUsername[0].toUpperCase()} {/* Show the first letter of the decoded username */}
        </Avatar>

        {/* User Info */}
        <Box ml={3}>
          {/* Username */}
          <Typography variant="h4" gutterBottom>
            {decodedUsername} {/* Display the decoded username */}
          </Typography>

          {/* Edit Profile Link */}
          <Link to="/settings/profile" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">
              Edit Profile
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
