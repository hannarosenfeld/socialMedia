import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.config.js"; // Ensure this is correctly importing your Firebase config
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from "firebase/auth"; // Import the necessary Firebase functions
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { Button, TextField, Typography, Box, Snackbar } from '@mui/material';
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if the email is already in use
      const emailMethods = await fetchSignInMethodsForEmail(auth, email);
      if (emailMethods.length) {
        throw new Error("Email already in use. Please use a different email.");
      }

      const userCredential = await signup(email, password);
      await saveUsername(userCredential.user.uid); // Save username after registration
      await updateUserProfile(userCredential.user, userName); // Set the displayName in Firebase Auth

      setSuccessMessage("User registered successfully!");

      // Now navigate only after everything completes
      navigate("/");  // Ensure this is the correct route

    } catch (err) {
      setError(err.message);
      console.error("Error during signup process:", err);  // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error during createUserWithEmailAndPassword:", error);
      throw error;
    }
  };

  // Function to save username in Firestore, with a default color of black
  const saveUsername = async (userId) => {
    try {
      await setDoc(doc(db, "users", userId), {
        username: userName,
        email: email,
        color: "#000000" // Default color set to black
      });
    } catch (error) {
      console.error("Error saving username to Firestore:", error);
      throw error;
    }
  };

  // Function to set the displayName in Firebase Auth
  const updateUserProfile = async (user, userName) => {
    try {
      await updateProfile(user, {
        displayName: userName
      });
      console.log("Display name set to:", userName);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
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
      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Username"
          variant="outlined"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={loading}
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
          disabled={loading}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          {loading ? "Registering..." : "Register"}
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

export default SignUpPage;
