import { Avatar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { deepPurple } from '@mui/material/colors'; 

const ProfilePage = ({ sessionUser }) => {
  const { username, profilePic } = sessionUser;

  // Ensure username is defined
  if (!username) {
    return <div>Error: Username not found</div>;
  }

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
        {/* Avatar with profile picture or default letter */}
        <Avatar
          src={profilePic || ''} // If profilePic exists, use it as the image source
          alt={username}
          sx={{ 
            bgcolor: deepPurple[500], 
            width: 100, 
            height: 100, 
            fontSize: 50 
          }}
        >
          {!profilePic && username[0].toUpperCase()} {/* Fallback to first letter if no photo */}
        </Avatar>

        <Box ml={3}>
          <Typography variant="h4" gutterBottom>
            {username}
          </Typography>

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
