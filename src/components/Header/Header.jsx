import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { toast } from 'react-toastify';

import useStyles from './styles.js';

const Header = ({ setCoords,type, setSearchKeyword, updateUserLocation, setSelectedPlace, handlePlaceSelect, fetchPlaces, address, setAddress, user, handleLogout}) => {
  const classes = useStyles();
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [autocompleteKey, setAutocompleteKey] = useState(Date.now());
  
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();

    if (!place.geometry || !place ) {
      toast.error('No details available for input: ' + (place ? place.name : "unknown input"));
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    updateUserLocation({ lat, lng });

    fetchPlaces(lat, lng, type);

    setAddress(place.formatted_address);

    setSearchValue('')
  };

  const options = {
    componentRestrictions: {
      country: 'ZA'
    },
    fields: ['address_components', 'formatted_address', 'geometry'],

  }


  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" className={classes.title}>
          Prim Finds
        </Typography>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
          Search Location
          </Typography>
          <Autocomplete key={autocompleteKey} onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} options={options}> 
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase 
              id='search'
              placeholder="Enter a location to explore..." 
              classes={{ 
                root: classes.inputRoot, 
                input: classes.inputInput 
              }} 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onPlaceChanged(autocomplete);
                }
              }}
              />
            </div>
          </Autocomplete> 
        </Box>
        <Box display="flex" alignItems="center">
          {user ? (
            <>
              <Typography variant="body1" style={{ marginRight: '16px' }}>
                Welcome, {user.email} {/* Display the user's email or name */}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => console.log('Login clicked')}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;