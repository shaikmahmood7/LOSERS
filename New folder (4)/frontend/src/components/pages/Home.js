import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import {
  DirectionsBus,
  Schedule,
  LocationOn,
  Feedback,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing(2),
  },
}));

const features = [
  {
    title: 'Live Schedule',
    description: 'Get real-time updates on bus and train schedules.',
    icon: <Schedule />,
  },
  {
    title: 'Route Tracking',
    description: 'Track your bus or train in real-time on the map.',
    icon: <LocationOn />,
  },
  {
    title: 'Multiple Routes',
    description: 'Access information for buses, trains, and metro services.',
    icon: <DirectionsBus />,
  },
  {
    title: 'Feedback System',
    description: 'Report issues and provide feedback to improve services.',
    icon: <Feedback />,
  },
];

const Home = () => {
  const classes = useStyles();

  return (
    <main>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Transport Hub
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Your one-stop solution for public transport information. Get real-time
            updates, track routes, and provide feedback to improve services.
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/routes"
                >
                  View Routes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <div style={{ textAlign: 'center' }}>
                    {React.cloneElement(feature.icon, {
                      className: classes.icon,
                      color: 'primary',
                    })}
                  </div>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

export default Home; 