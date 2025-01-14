// Render Screen Content
const renderScreen = () => {
  switch (screen) {
    case 'getStarted':
      return (
        <Paper className={classes.getStartedContainer}>
          <img src={logo} alt="Get Started" className={classes.image} />
          <Typography variant="h4" className={classes.title}>PRIM FINDS</Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>Discover the businesses you need with ease📍!</Typography>
          <Button className={classes.button} onClick={() => setScreen('login')} variant="contained">Sign In</Button>
          <Button className={classes.secondaryButton} onClick={() => setScreen('signup')} variant="outlined">Sign Up</Button>
        </Paper>
      );

    case 'login':
      return (
        <Paper className={classes.formContainer}>
          <Typography variant="h4" className={classes.title}>Login</Typography>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth className={classes.input} error={!!emailError} helperText={emailError} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth className={classes.input} error={!!passwordError} helperText={passwordError} />
          <Button onClick={() => handleLogin(email, password)} className={classes.button} variant="contained">Login</Button>
          <Typography onClick={() => setScreen('signup')} className={classes.switchButton}>Don't have an account? Sign Up</Typography>
        </Paper>
      );

    case 'signup':
      return (
        <Paper className={classes.formContainer}>
          <Typography variant="h4" className={classes.title}>Sign Up</Typography>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth className={classes.input} error={!!emailError} helperText={emailError} />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth className={classes.input} error={!!passwordError} helperText={passwordError} />
          <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth className={classes.input} error={!!confirmPasswordError} helperText={confirmPasswordError} />
          <Button onClick={handleSignup} className={classes.button} variant="contained">Sign Up</Button>
          <Typography onClick={() => setScreen('login')} className={classes.switchButton}>Already have an account? Login</Typography>
        </Paper>
      );

    case 'welcome':
      return (
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>Welcome to PRIM FINDS</Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>Discover the best local businesses with PRIM FINDS!</Typography>
          <Button onClick={() => setScreen('home')} className={classes.button} variant="contained">Go to Home</Button>
        </Paper>
      );

    case 'profile':
      return (
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>Profile</Typography>
          {user ? (
            <>
              <img src={profileData.profilePicture || 'https://via.placeholder.com/100'} alt="Profile" style={{ width: '100px', borderRadius: '50%', marginBottom: '20px' }} />
              {isEditing ? (
                <>
                  <TextField label="Username" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} fullWidth />
                  <Button onClick={handleSaveProfile} className={classes.button} variant="contained">Save Changes</Button>
                </>
              ) : (
                <>
                  <Typography>Email: {profileData.email}</Typography>
                  <Button onClick={() => setIsEditing(true)} variant="outlined">Edit Profile</Button>
                </>
              )}
              <Button onClick={handleLogout} variant="outlined">Log Out</Button>
            </>
          ) : <Typography>No user information available.</Typography>}
          <Button onClick={() => setScreen('home')} variant="outlined">Back to Home</Button>
        </Paper>
      );

    case 'favorites':
      useEffect(fetchFavorites, [user]);
      return (
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>Saved Places</Typography>
          <List>{favorites.map((place, i) => <ListItem key={i}><ListItemText primary={place.name} /></ListItem>)}</List>
          <Button onClick={() => setScreen('home')} variant="outlined">Back to Home</Button>
        </Paper>
      );

    case 'history':
      useEffect(fetchHistory, [user]);
      return (
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>Activity History</Typography>
          <List>{history.map((activity, i) => <ListItem key={i}><ListItemText primary={activity.placeName} /></ListItem>)}</List>
          <Button onClick={() => setScreen('home')} variant="outlined">Back to Home</Button>
        </Paper>
      );

    case 'home':
      return (
        <>
            <Header
              setCoords={setCoords}
              updateUserLocation={updateUserLocation}
              type={type}
              setSelectedPlace={setSelectedPlace}
              handlePlaceSelect={handlePlaceSelect}
              fetchPlaces={fetchPlaces}
              setAddress={setAddress}
              address={address}
              user={user} 
              handleLogout={handleLogout}
            />
          <Grid container spacing={3} style={{ width: '100%' }}>
            <Grid item xs={12} md={4}>
              <List
                isLoading={isLoading}
                type={type}
                setType={setType}
                places={places}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                radius={radius}
                setRadius={setRadius}
                noPlacesMessage={noPlacesMessage}
              />
            </Grid>
            <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Map
                setCoords={setCoords}
                coords={coords}
                onPlacesChange={handlePlacesChange}
                setSelectedPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                type={type}
                radius={radius}
                updateUserLocation={updateUserLocation}
                fetchPlaces={fetchPlaces}
                places={places}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                setAddress={setAddress}
                address={address}
              />
            </Grid>
          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button onClick={() => setScreen('profile')} variant="contained">Profile</Button>
            <Button onClick={() => setScreen('favorites')} variant="contained" style={{ marginLeft: '10px' }}>Saved Places</Button>
            <Button onClick={() => setScreen('history')} variant="contained" style={{ marginLeft: '10px' }}>Activity History</Button>
          </div>
        </>
      );

    default:
      return <div>Unknown screen</div>;
  }
};

return (
  <>
    <CssBaseline />
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    {renderScreen()}
  </>
);
};