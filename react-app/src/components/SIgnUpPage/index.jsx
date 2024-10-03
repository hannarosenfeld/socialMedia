import { useState } from "react";
import { auth } from "../../firebase.config.js"; // Import auth from your Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import the function to create a user
import { Button, TextField, Typography, Box, Snackbar } from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      await signup(email, password);
      setSuccessMessage("User registered successfully!"); // Set success message
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error; // Throw the error to be caught in handleRegister
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
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
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
          Register
        </Button>
      </form>
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Box>
  );
};

export default Register;
