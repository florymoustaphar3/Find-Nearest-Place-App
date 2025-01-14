import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

import eastLogo from '../../assets/images/primfinds.png'

const List = ({ places, type, setType, rating, setRating, childClicked, isLoading, selectedPlace, radius, setRadius, noPlacesMessage, handleBookNow }) => {
  const [elRefs, setElRefs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => Array(places?.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places]);

  const handleListItemClick = (placeId) => {
    childClicked(placeId);
  }

  return (
    <div className={classes.container}>
      <Typography variant="h4">Find Places by</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select 
            id="type" 
            value={type} 
            onChange={(e) => setType(e.target.value)}     
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 124, // This controls the height of the menu (in pixels)
                },
              },
            }}>
              <MenuItem value="restaurant">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
              <MenuItem value="malls">Malls</MenuItem>
              <MenuItem value="hospital">Hospitals</MenuItem>
              <MenuItem value="car_rental">Car Rental</MenuItem>
              <MenuItem value="school">Schools</MenuItem>
              <MenuItem value="casino">Casino</MenuItem>
              <MenuItem value="police">Police</MenuItem>
              <MenuItem value="night_club">Night Club</MenuItem>
              <MenuItem value="travel_agency">Travel Agency</MenuItem>
              <MenuItem value="veterinary_care">Veterinary Care</MenuItem>
              <MenuItem value="church">Church</MenuItem>
              <MenuItem value="embassy">Embassy</MenuItem>
              <MenuItem value="atm">Atm</MenuItem>
              <MenuItem value="stadium">Stadium</MenuItem>
            </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
            <InputLabel id="radius">Radius</InputLabel>
            <Select 
            id="radius" 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)}     
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 124, // This controls the height of the menu (in pixels)
                },
              },
            }}>
              <MenuItem value={1000}>1 km</MenuItem>
              <MenuItem value={5000}>5 km</MenuItem>
              <MenuItem value={10000}>10 km</MenuItem>
              <MenuItem value={20000}>20 km</MenuItem>
              <MenuItem value={30000}>30 km</MenuItem>
              <MenuItem value={50000}>50 km</MenuItem>
            </Select>
          </FormControl>
          {isLoading ? (
            <div className={classes.loading}>
              <CircularProgress size="5rem" />
            </div>
              ) : places?.length === 0  ? (
                <Typography variant="subtitle1" style={{ textAlign: 'center', marginTop: '20px' }}>{noPlacesMessage}</Typography>
              ) : (
          <>
              <Grid container spacing={3} className={classes.list}>
              {places?.map((place, i) => (
                <Grid item xs={12} key={i}>
                  <PlaceDetails place={place} onListItemClick={handleListItemClick} onBookNow={handleBookNow} />
                </Grid>
              ))}
              </Grid>

              <div className={classes.logoContainer}>
                <img src={eastLogo} alt="Prim Finds Logo" className={classes.logo} />
              </div>
          </>
      )}
    </div>
  );
};

export default List;
