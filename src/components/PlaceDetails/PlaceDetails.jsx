import React, { useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Modal } from '@material-ui/core';
import { LocationOnOutlined } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import useStyles from './styles.js';

// Modal Styles
const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const PlaceDetails = ({ place, selected, refProp, onBookNow }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false); // Modal state

  if (selected) refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <Card elevation={6}>
        {place.photos && place.photos.length > 0 ? (
          <CardMedia
            style={{ height: 350 }}
            image={place.photos[0].getUrl({ maxWidth: 250, maxHeight: 150 })}
            title={place.name}
          />
        ) : (
          <CardMedia style={{ height: 350 }} image="/path/to/default/image.jpg" title={place.name} />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5">{place.name}</Typography>

          {place.rating && (
            <Box display="flex" alignItems="center">
              <Rating value={place.rating} readOnly precision={0.1} />
              <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
                {place.rating.toFixed(1)} ({place.user_ratings_total} reviews)
              </Typography>
            </Box>
          )}

          {place.vicinity && (
            <Typography gutterBottom variant="subtitle2" color="textSecondary" className={classes.subtitle}>
              <LocationOnOutlined style={{ color: '#cb1112' }} /> {place.vicinity}
            </Typography>
          )}

          {/* Display Website */}
          {place.website && (
            <Typography variant="body2" color="primary">
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                {place.website}
              </a>
            </Typography>
          )}

          {/* Display Phone Number */}
          {place.formatted_phone_number && (
            <Typography variant="body2" style={{ marginTop: '10px', color: 'black' }}>
              Phone: {place.formatted_phone_number}
            </Typography>
          )}

          {place.opening_hours && (
            <Typography gutterBottom variant="body2" color="textSecondary" className={classes.spacing}>
              {place.opening_hours.isOpen ? 'Open Now' : 'Closed'}
            </Typography>
          )}

          {/* Get Directions Button */}
          <Button variant="outlined" color="primary" onClick={handleOpenModal} style={{ marginTop: '10px' }}>
            Get Directions
          </Button>

          {/* Book Now Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onBookNow(place)}
            style={{ marginTop: '10px', marginLeft: '10px' }}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>

      {/* Directions Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyles}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', marginBottom: '15px' }}>
            Directions to {place.name}
          </Typography>
          
          {/* Embed Google Maps Directions */}
          <iframe
            title="Google Maps Directions"
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyB62umSLriqeWnO3Buh4Bso7eYWwKXcAJs&origin=${place.geometry.location.lat()},${place.geometry.location.lng()}&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}&mode=driving`}
            allowFullScreen
          ></iframe>
        </Box>
      </Modal>
    </>
  );
};

export default PlaceDetails;
