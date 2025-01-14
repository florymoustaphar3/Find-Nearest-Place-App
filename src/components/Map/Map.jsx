import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript, Circle } from '@react-google-maps/api';
import { Typography, Button, Modal, Box } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { toast } from 'react-toastify';

import markerBrand from '../../assets/images/markerBrand.svg';
import markerBrand1 from '../../assets/images/markerBrand1.svg';
import useStyles from './styles.js';

const libraries = ['places', 'geometry'];

const mapContainerStyle = {
  height: '85vh',
  width: '100%',
};

const options = {
  disableDefaultUI: true,
  clickableIcons: false,
  zoomControl: true,
  mapId: 'e18a7a9e8f3dc988',
  mapTypeControl: true,
};

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

const Map = ({
  setCoords, setBounds, places, setChildClicked, onPlacesChange, userLocation,
  setUserLocation, type, searchKeyword, updateUserLocation, fetchPlaces, setAddress, address, radius,
}) => {
  const classes = useStyles();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB62umSLriqeWnO3Buh4Bso7eYWwKXcAJs',
    libraries,
  });

  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [open, setOpen] = useState(false); // Modal state
  const [showFullReview, setShowFullReview] = useState(false); // State to toggle full review display

  const defaultLocation = {
    lat: -26.093611,
    lng: 28.006390,
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // Fetch Place Details (for additional info like phone, website)
  const fetchPlaceDetails = (placeId) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      placeId: placeId,
      fields: ['name', 'formatted_phone_number', 'website', 'rating', 'geometry', 'photos', 'reviews', 'vicinity'],
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(place); // Set detailed place data
      } else {
        toast.error('Failed to load place details');
      }
    });
  };

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        setUserLocation({ lat, lng });
      } else {
        toast.error('Geocoding failed: ' + status);
      }
    });
  }, [setAddress]);

  useEffect(() => {
    if (isLoaded) {
      let lat, lng;
      if (userLocation?.lat && userLocation?.lng) {
        lat = userLocation.lat;
        lng = userLocation.lng;
      } else {
        lat = defaultLocation.lat;
        lng = defaultLocation.lng;
        updateUserLocation(defaultLocation);
      }
      fetchPlaces(lat, lng, type);
    }
  }, [isLoaded, userLocation, type]);

  const truncateText = (text, wordLimit) => {
    const wordsArray = text.split(' ');
    if (wordsArray.length > wordLimit) {
      return wordsArray.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className={classes.mapContainer}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultLocation}
        zoom={10}
        options={options}
        onClick={onMapClick}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            draggable={true}
            onDragEnd={(e) => {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              const newPos = { lat: newLat, lng: newLng };

              setUserLocation(newPos);

              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: newPos }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  setAddress(results[0].formatted_address);
                } else {
                  console.error('Could not fetch address at this location.');
                }
              });

              fetchPlaces(newLat, newLng, type);
            }}
            onClick={() => setShowInfoWindow(true)}
            icon={{
              url: markerBrand,
              scaledSize: new window.google.maps.Size(30, 37),
              size: new window.google.maps.Size(30, 37),
              anchor: new window.google.maps.Point(15, 37),
            }}
          >
            <Circle
              center={userLocation}
              radius={Number(radius)}
              options={{
                strokeColor: '#9140C2',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#9140C2',
                fillOpacity: 0.35,
                clickable: false,
                draggable: false,
                editable: false,
                visible: true,
                zIndex: 1,
              }}
            />
            {showInfoWindow && (
              <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                <div>
                  <h3 style={{ color: 'blue', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                    Your Location
                  </h3>
                  <p style={{ color: 'black', fontSize: '14px' }}>
                    {address || 'Fetching address...'}
                  </p>
                  <p style={{ fontSize: '14px', textAlign: 'center' }}>
                    Drag the marker to update location.
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}

        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            onClick={() => {
              fetchPlaceDetails(place.place_id); // Fetch detailed place info
            }}
            icon={{
              url: markerBrand1,
              scaledSize: new window.google.maps.Size(30, 37),
              anchor: new window.google.maps.Point(15, 37),
            }}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div style={{ maxWidth: '250px', maxHeight: '350px', overflowY: 'auto' }}>
              <Typography variant="subtitle2" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {selectedPlace.name}
              </Typography>
              {selectedPlace.rating && (
                <div style={{ marginBottom: '5px' }}>
                  <Rating name="read-only" value={Number(selectedPlace.rating)} readOnly />
                </div>
              )}
              {selectedPlace.photos?.[0]?.getUrl && (
                <img
                  src={selectedPlace.photos[0].getUrl({ maxWidth: 250, maxHeight: 150 })}
                  alt="Place"
                  style={{ width: '100%', height: 'auto', borderRadius: '5px', marginBottom: '5px' }}
                />
              )}
              <Typography variant="body2" style={{ color: '#555' }}>
                {showFullReview
                  ? selectedPlace.reviews?.[0]?.text || 'No description available.'
                  : truncateText(selectedPlace.reviews?.[0]?.text || 'No description available.', 100)}
              </Typography>
              {selectedPlace.reviews?.[0]?.text?.split(' ').length > 50 && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setShowFullReview((prev) => !prev)}
                >
                  {showFullReview ? 'Show less' : 'Read more'}
                </Button>
              )}
              {selectedPlace.website && (
                <Typography variant="body2" color="primary">
                  <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                    {selectedPlace.website}
                  </a>
                </Typography>
              )}
              {selectedPlace.formatted_phone_number && (
                <Typography variant="body2" style={{ marginTop: '10px', color: 'black' }}>
                  Phone: {selectedPlace.formatted_phone_number}
                </Typography>
              )}
              <Typography
                variant="body2"
                style={{ marginTop: '10px', color: 'blue', cursor: 'pointer' }}
                onClick={handleOpenModal}
              >
                Get Directions
              </Typography>
            </div>
          </InfoWindow>
        )}

        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={modalStyles}>
            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '15px' }}>
              Directions to {selectedPlace?.name}
            </Typography>
            <iframe
              title="Google Maps Directions"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyB62umSLriqeWnO3Buh4Bso7eYWwKXcAJs&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedPlace?.geometry.location.lat()},${selectedPlace?.geometry.location.lng()}&mode=driving`}
              allowFullScreen
            ></iframe>
          </Box>
        </Modal>
      </GoogleMap>
    </div>
  );
};

export default Map;
