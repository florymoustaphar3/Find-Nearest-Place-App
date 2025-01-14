import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { db } from '../../firebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Booking = ({ user, selectedPlace, setScreen }) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
  });

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
  };

  const handleBookingSubmit = async () => {
    if (!isValidDate(bookingData.date)) {
      toast.error('You cannot book a past date. Please select a valid date.');
      return;
    }

    if (user && selectedPlace) {
      try {
        await addDoc(collection(db, 'bookings'), {
          userId: user.uid,
          placeId: selectedPlace.place_id,
          placeName: selectedPlace.name,
          ...bookingData,
          timestamp: Timestamp.now(),
        });
        toast.success('Booking confirmed!');
        setScreen('home'); // Redirect to home or bookings page
      } catch (error) {
        console.error('Error adding booking: ', error);
        toast.error('Failed to confirm booking.');
      }
    } else {
      toast.error('User or place information is missing.');
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <Typography variant="h5">Book {selectedPlace.name}</Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Date"
          type="date"
          name="date"
          value={bookingData.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Time"
          type="time"
          name="time"
          value={bookingData.time}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Guests"
          type="number"
          name="guests"
          value={bookingData.guests}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Special Requests"
          name="specialRequests"
          value={bookingData.specialRequests}
          onChange={handleInputChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleBookingSubmit}
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Confirm Booking
        </Button>
        <Button
          onClick={() => setScreen('home')}
          variant="outlined"
          color="secondary"
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Cancel
        </Button>
      </form>
    </Paper>
  );
};

export default Booking;
