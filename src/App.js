import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Grid,
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import logo from "../src/assets/images/prim.jpeg";
import Booking from "./components/Booking/Booking";
import BookingsList from "./components/Booking/BookingsList";
import ResetPassword from "./components/resetPassword/ResetPassword";
import { auth, db } from "./firebaseConfig"; // Import Firebase auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    animation: `$fadeIn 1.5s ease-in-out`,
  },
  getStartedContainer: {
    padding: theme.spacing(6),
    maxWidth: 500,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: theme.spacing(2),
    boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
    textAlign: "center",
    animation: `$fadeInUp 1.5s ease-in-out forwards`, // Slide up effect on container
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: "bold",
    color: theme.palette.primary.main,
    animation: `$bounce 2s infinite`, // Bounce effect on title
  },
  subtitle: {
    marginBottom: theme.spacing(5),
    color: "#555",
    opacity: 0,
    animation: `$fadeInDelay 2s ease-in forwards`, // Fade-in effect with delay for subtitle
  },
  button: {
    padding: theme.spacing(1.5),
    margin: theme.spacing(2, 0),
    fontSize: "1.2rem",
    fontWeight: "bold",
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    animation: `$pulse 1.5s ease-in-out infinite`, // Pulsing effect on button
  },
  secondaryButton: {
    padding: theme.spacing(1.5),
    fontSize: "1.2rem",
    fontWeight: "bold",
    width: "100%",
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
    border: `2px solid ${theme.palette.primary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: "#fff",
    },
  },
  image: {
    width: "25%",
    height: "auto",
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  formContainer: {
    padding: theme.spacing(4),
    maxWidth: 400,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: theme.spacing(1),
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  switchButton: {
    marginTop: theme.spacing(2),
    color: theme.palette.secondary.main,
    cursor: "pointer",
  },
  // Keyframes
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  "@keyframes fadeInUp": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
    "40%": { transform: "translateY(-15px)" },
    "60%": { transform: "translateY(-10px)" },
  },
  "@keyframes fadeInDelay": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },
}));

const App = () => {
  const classes = useStyles();
  const [screen, setScreen] = useState("getStarted"); // 'getStarted', 'login', 'signup', 'welcome', 'home'
  const [type, setType] = useState("restaurant");
  const [coords, setCoords] = useState({});
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [radius, setRadius] = useState("50000");
  const [address, setAddress] = useState("");
  const [noPlacesMessage, setNoPlacesMessage] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    username: "",
    phoneNumber: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // reset password

  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");

  // Effects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setScreen("welcome");
      } else {
        setUser(null);
        setScreen("getStarted");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user]);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchPlaces(userLocation.lat, userLocation.lng, type, radius);
    }
  }, [type, radius, userLocation]);

  const fetchProfileData = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfileData(docSnap.data());
    }
  };

  const fetchFavorites = async () => {
    if (user) {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setFavorites(querySnapshot.docs.map((doc) => doc.data()));
    }
  };

  const fetchHistory = async () => {
    if (user) {
      try {
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const activityHistory = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(activityHistory);
        console.log("History loaded:", activityHistory); // For debugging
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load activity history.");
      }
    }
  };

  // Auth Handlers
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    // Explanation of regex:
    // (?=.*[A-Z])    -> At least one uppercase letter
    // (?=.*\d)       -> At least one numeric digit
    // (?=.*[@$!%*?&]) -> At least one special character
    // {6,}           -> At least 6 characters long
    return passwordRegex.test(password);
  };

  const handleLogin = (email, password) => {
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => setScreen("welcome"))
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setEmailError("No user found with this email.");
        } else if (error.code === "auth/wrong-password") {
          setPasswordError("Incorrect password.");
        } else if (error.code === "auth/invalid-email") {
          setEmailError("Invalid email format.");
        } else {
          setEmailError("Failed to sign in.");
        }
      });
  };

  const handleSignup = (email, password) => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(
        "Password must be at least 6 characters long, include at least one uppercase letter, one numeric digit, and one special character."
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => setScreen("welcome"))
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setEmailError("Email already in use.");
        } else if (error.code === "auth/weak-password") {
          setPasswordError("Password should be at least 6 characters.");
        } else {
          setEmailError("Failed to sign up.");
        }
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signed out successfully");
        setScreen("getStarted");
      })
      .catch((error) => toast.error(error.message));
  };

  const handleSignupSubmit = () => {
    setConfirmPasswordError("");
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match.");
      return;
    }
    handleSignup(email, password);
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Firestore save error:", error);
        toast.error("Failed to update profile");
      }
    } else {
      toast.error("User not authenticated");
    }
  };

  const updateUserLocation = (newLocation) => {
    setUserLocation(newLocation);
  };

  const handlePlacesChange = (newPlaces) => {
    setPlaces(newPlaces);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setPlaces([...places, place]);
  };

  const handlePasswordReset = (email) => {
    setResetEmailError("");
    if (!email) {
      setResetEmailError("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent! Please check your inbox.");
        setScreen("login"); // Redirect to login after success
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error); // Log the error for debugging
        if (error.code === "auth/user-not-found") {
          setResetEmailError("No user found with this email.");
        } else if (error.code === "auth/invalid-email") {
          setResetEmailError("Invalid email format.");
        } else {
          setResetEmailError("Failed to send reset email.");
        }
      });
  };

  const fetchPlaces = (lat, lng, type, radius) => {
    setIsLoading(true);
    const effectiveRadius = Number(radius) > 0 ? Number(radius) : 50000;

    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: effectiveRadius,
      type: [type],
      maxResultCount: 10,
    };

    if (!lat || !lng || !radius) {
      console.error("Invalid request parameters for fetching places.");
      setIsLoading(false);
      return;
    }

    service.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        setPlaces(results);
        handlePlacesChange(results);
        setNoPlacesMessage("");
      } else {
        setPlaces([]);
        handlePlacesChange([]);
        setNoPlacesMessage(`There are no ${type} around your location.`);
        toast.error(`No ${type}  found around your location.`);
      }
      setIsLoading(false);
    });
  };

  // Fetch Profile Data only when `screen` is 'profile'
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && screen === "profile") {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No profile data found.");
        }
      }
    };

    fetchProfileData();
  }, [user, screen]);

  const handleBookNow = (place) => {
    setSelectedPlace(place);
    setScreen("booking");
  };

  if (screen === "booking") {
    return (
      <Booking
        user={user}
        selectedPlace={selectedPlace}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "bookings") {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <BookingsList user={user} setScreen={setScreen} />
      </>
    );
  }

  // Render Reset Password Screen
  if (screen === "resetPassword") {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <ResetPassword setScreen={setScreen} />
      </>
    );
  }

  // Render Profile Screen
  if (screen === "profile") {
    const handleChange = (e) => {
      setProfileData({
        ...profileData,
        [e.target.name]: e.target.value,
      });
    };

    return (
      <div className={classes.root}>
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>
            Profile
          </Typography>

          {user ? (
            <>
              <img
                src={
                  profileData.profilePicture ||
                  "https://via.placeholder.com/100"
                }
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "20px",
                }}
              />

              {isEditing ? (
                <>
                  <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    value={profileData.username}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    label="Profile Picture URL"
                    name="profilePicture"
                    fullWidth
                    value={profileData.profilePicture}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Button
                    className={classes.button}
                    onClick={handleSaveProfile} // <-- Using handleSaveProfile here
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "20px" }}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body1">
                    Email: {profileData.email}
                  </Typography>
                  <Typography variant="body1">
                    Username: {profileData.username || "Not set"}
                  </Typography>
                  <Typography variant="body1">
                    Phone Number: {profileData.phoneNumber || "Not set"}
                  </Typography>
                  <Button
                    className={classes.secondaryButton}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                    style={{ marginTop: "20px" }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}

              <Button
                className={classes.secondaryButton}
                onClick={handleLogout}
                variant="outlined"
                style={{ marginTop: "20px" }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <Typography variant="body2">
              No user information available.
            </Typography>
          )}

          <Button
            className={classes.secondaryButton}
            onClick={() => setScreen("home")}
            variant="outlined"
            style={{ marginTop: "20px" }}
          >
            Back to Home
          </Button>
        </Paper>
      </div>
    );
  }

  // Render Welcome Screen
  if (screen === "welcome") {
    return (
      <div className={classes.root}>
        <Paper className={classes.getStartedContainer}>
          <Typography variant="h4" className={classes.title}>
            Welcome to PRIM FINDS
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Discover the best local businesses in your area with PRIM FINDS. Our
            mission is to help you connect with places that matter the most to
            you!
          </Typography>
          <Button
            className={classes.button}
            onClick={() => setScreen("home")}
            variant="contained"
          >
            Go to Home
          </Button>
        </Paper>
      </div>
    );
  }

  // Render "Get Started" Page
  if (screen === "getStarted") {
    return (
      <div className={classes.root}>
        <Paper className={classes.getStartedContainer}>
          <img src={logo} alt="Get Started" className={classes.image} />
          <Typography variant="h4" className={classes.title}>
            PRIM FINDS
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Discover the businesses you need with ease📍! Click the button below
            to create an account 😀
          </Typography>
          <Button
            className={classes.button}
            onClick={() => setScreen("login")}
            variant="contained"
          >
            Sign In
          </Button>
          <Button
            className={classes.secondaryButton}
            onClick={() => setScreen("signup")}
            variant="outlined"
          >
            Sign Up
          </Button>
        </Paper>
      </div>
    );
  }

  // Render Login Screen
  if (screen === "login") {
    return (
      <div className={classes.root}>
        <Paper className={classes.formContainer}>
          <Typography variant="h4" className={classes.title}>
            Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            className={classes.input}
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            className={classes.input}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            onClick={() => handleLogin(email, password)}
            className={classes.button}
            variant="contained"
          >
            Login
          </Button>
          <Typography
            variant="body2"
            className={classes.switchButton}
            onClick={() => setScreen("signup")}
          >
            Don't have an account? Sign Up
          </Typography>
          <Typography
            variant="body2"
            className={classes.switchButton}
            onClick={() => setScreen("resetPassword")}
          >
            Forgot your password? Reset it here
          </Typography>
        </Paper>
      </div>
    );
  }

  // Render Signup Screen
  if (screen === "signup") {
    return (
      <div className={classes.root}>
        <Paper className={classes.formContainer}>
          <Typography variant="h4" className={classes.title}>
            Sign Up
          </Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            className={classes.input}
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            className={classes.input}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            className={classes.input}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            onClick={handleSignupSubmit}
            className={classes.button}
            variant="contained"
          >
            Sign Up
          </Button>
          <Typography
            variant="body2"
            className={classes.switchButton}
            onClick={() => setScreen("login")}
          >
            Already have an account? Login
          </Typography>
        </Paper>
      </div>
    );
  }

  // Render Home Screen
  return (
    <>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Header
        setCoords={setCoords}
        updateUserLocation={updateUserLocation}
        type={type}
        setType={setType}
        setSelectedPlace={setSelectedPlace}
        handlePlaceSelect={handlePlaceSelect}
        fetchPlaces={fetchPlaces}
        setAddress={setAddress}
        address={address}
        user={user}
        handleLogout={handleLogout}
      />

      <Box
        display="flex"
        justifyContent="right"
        marginTop={1}
        paddingLeft={2}
        paddingRight={2}
        gap={2}
      >
        <Button
          onClick={() => setScreen("profile")}
          variant="contained"
          color="primary"
        >
          Profile
        </Button>
        <Button
          onClick={() => setScreen("bookings")}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
        >
          My Bookings
        </Button>
      </Box>
      <Grid container spacing={3} style={{ width: "100%" }}>
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
            handleBookNow={handleBookNow}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
    </>
  );
};

export default App;
