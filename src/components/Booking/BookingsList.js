import React, { useState, useEffect } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import { db } from '../../firebaseConfig'; // Adjust the path to your firebaseConfig
import { collection, query, where, getDocs } from 'firebase/firestore';

const BookingsList = ({ user, setScreen }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5">Your Bookings</Typography>
      {bookings.length > 0 ? (
        <List>
          {bookings.map(booking => (
            <ListItem key={booking.id} style={{ borderBottom: '1px solid #ccc' }}>
              <ListItemText
                primary={`Booking at: ${booking.placeName}`}
                secondary={`Date: ${booking.date} | Time: ${booking.time} | Guests: ${booking.guests}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No bookings found.</Typography>
      )}
      <button onClick={() => setScreen('home')} style={{ marginTop: '20px' }}>
        Back to Home
      </button>
    </Paper>
  );
};

export default BookingsList;
