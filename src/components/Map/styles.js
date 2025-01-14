import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px',
  },
  mapContainer: {
    height: '85vh', width: '100%',
  },
  markerContainer: {
    position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
  },
  pointer: {
    cursor: 'pointer',
  },
  logoContainer: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    margin: '10px', 
    zIndex: 9,

  },
  logo: {
    maxHeight: '50px', // Adjust size as needed
    maxWidth: '100%', 
  },
}));