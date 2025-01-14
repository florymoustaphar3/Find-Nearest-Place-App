import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = ({ setScreen }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');

  const handlePasswordReset = (email) => {
    setResetEmailError('');
    if (!email) {
      setResetEmailError('Please enter your email.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Password reset email sent! Please check your inbox.');
        setScreen('login'); // Redirect to login after success
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        if (error.code === 'auth/user-not-found') {
          setResetEmailError('No user found with this email.');
        } else if (error.code === 'auth/invalid-email') {
          setResetEmailError('Invalid email format.');
        } else {
          setResetEmailError('Failed to send reset email.');
        }
      });
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* Add ToastContainer here */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <Typography variant="h5">Reset Password</Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          required
          error={!!resetEmailError}
          helperText={resetEmailError}
          margin="normal"
        />
        <Button
          onClick={() => handlePasswordReset(resetEmail)}
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Reset Password
        </Button>
        <Button
          onClick={() => setScreen('login')}
          variant="outlined"
          color="secondary"
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Back to Login
        </Button>
      </form>
    </Paper>
  );
};

export default ResetPassword
