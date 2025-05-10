import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  searchBar: {
    marginBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  status: {
    display: 'inline-block',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
  },
  statusActive: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  statusInactive: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const RouteList = () => {
  const classes = useStyles();
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch routes from API
    const mockRoutes = [
      {
        id: 1,
        routeNumber: '101',
        name: 'Downtown Express',
        type: 'bus',
        status: 'active',
        description: 'Express service to downtown area',
      },
      {
        id: 2,
        routeNumber: '202',
        name: 'Metro Line 1',
        type: 'metro',
        status: 'active',
        description: 'Main metro line connecting north and south',
      },
      {
        id: 3,
        routeNumber: '303',
        name: 'Train Route A',
        type: 'train',
        status: 'inactive',
        description: 'Intercity train service',
      },
    ];
    setRoutes(mockRoutes);
  }, []);

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || route.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid container spacing={3} className={classes.searchBar}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Transport Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Transport Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="bus">Bus</MenuItem>
              <MenuItem value="train">Train</MenuItem>
              <MenuItem value="metro">Metro</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredRoutes.map((route) => (
          <Grid item key={route.id} xs={12} sm={6} md={4}>
            <Card
              component={RouterLink}
              to={`/routes/${route.id}`}
              className={classes.card}
            >
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {route.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Route {route.routeNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {route.description}
                </Typography>
                <Typography
                  className={`${classes.status} ${
                    route.status === 'active'
                      ? classes.statusActive
                      : classes.statusInactive
                  }`}
                  variant="body2"
                >
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RouteList; 