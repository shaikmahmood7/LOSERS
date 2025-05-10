import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  map: {
    height: 400,
    width: '100%',
  },
  scheduleList: {
    maxHeight: 400,
    overflow: 'auto',
  },
  stopList: {
    maxHeight: 400,
    overflow: 'auto',
  },
}));

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const RouteDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    // TODO: Fetch route details from API
    const mockRoute = {
      id: parseInt(id),
      routeNumber: '101',
      name: 'Downtown Express',
      type: 'bus',
      status: 'active',
      description: 'Express service to downtown area',
      stops: [
        {
          name: 'Central Station',
          location: { lat: 40.7128, lng: -74.006 },
          estimatedTime: 0,
        },
        {
          name: 'City Hall',
          location: { lat: 40.7135, lng: -74.0065 },
          estimatedTime: 5,
        },
        {
          name: 'Financial District',
          location: { lat: 40.7142, lng: -74.007 },
          estimatedTime: 10,
        },
      ],
      schedule: [
        { departureTime: '06:00', vehicleId: 'BUS001' },
        { departureTime: '06:30', vehicleId: 'BUS002' },
        { departureTime: '07:00', vehicleId: 'BUS003' },
      ],
    };
    setRoute(mockRoute);
    if (mockRoute.stops.length > 0) {
      setCenter(mockRoute.stops[0].location);
    }
  }, [id]);

  if (!route) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" gutterBottom>
              {route.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Route {route.routeNumber}
            </Typography>
            <Typography variant="body1" paragraph>
              {route.description}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Route Map
            </Typography>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
              >
                {route.stops.map((stop, index) => (
                  <Marker
                    key={index}
                    position={stop.location}
                    label={(index + 1).toString()}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Schedule
            </Typography>
            <List className={classes.scheduleList}>
              {route.schedule.map((schedule, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={schedule.departureTime}
                      secondary={`Vehicle: ${schedule.vehicleId}`}
                    />
                  </ListItem>
                  {index < route.schedule.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Stops
            </Typography>
            <List className={classes.stopList}>
              {route.stops.map((stop, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={stop.name}
                      secondary={`Estimated time: ${stop.estimatedTime} minutes`}
                    />
                  </ListItem>
                  {index < route.stops.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RouteDetail; 