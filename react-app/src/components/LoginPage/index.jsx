import { useState } from "react";
import { auth } from "../../firebase/firebase.config.js"; // Import auth from your Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the function to sign in a user
import { Button, TextField, Typography, Box, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
console.log("💄")
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      await login(email, password);
      setSuccessMessage("User logged in successfully!"); // Set success message
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error; // Throw the error to be caught in handleLogin
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: 'background.default', padding: 3 }}
    >
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />

      {/* Add a link to the sign-up page */}
      <Box mt={2}>
        <Typography variant="body2">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
