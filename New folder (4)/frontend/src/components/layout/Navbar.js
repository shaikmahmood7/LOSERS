import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  makeStyles,
} from '@material-ui/core';
import {
  Notifications as NotificationsIcon,
  DirectionsBus as BusIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const isAuthenticated = false; // Replace with actual auth state
  const isAdmin = false; // Replace with actual admin state

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <BusIcon className={classes.icon} />
            <RouterLink to="/" className={classes.link}>
              Transport Hub
            </RouterLink>
          </Typography>

          <Button color="inherit" component={RouterLink} to="/routes">
            Routes
          </Button>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin">
                  Admin
                </Button>
              )}
              <Button color="inherit">Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar; 