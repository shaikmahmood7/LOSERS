import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    marginTop: theme.spacing(2),
  },
}));

const ComplaintForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    route: '',
    vehicle: '',
    attachments: [],
  });

  useEffect(() => {
    // TODO: Fetch routes from API
    const mockRoutes = [
      { id: 1, routeNumber: '101', name: 'Downtown Express' },
      { id: 2, routeNumber: '202', name: 'Metro Line 1' },
    ];
    setRoutes(mockRoutes);
  }, []);

  const { title, description, type, route, vehicle, attachments } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, attachments: [...attachments, ...files] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement complaint submission
    console.log('Complaint submitted:', formData);
    history.push('/complaints');
  };

  return (
    <Container className={classes.container} maxWidth="md">
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Submit a Complaint
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={title}
                onChange={onChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={description}
                onChange={onChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Complaint Type</InputLabel>
                <Select
                  name="type"
                  value={type}
                  onChange={onChange}
                  label="Complaint Type"
                >
                  <MenuItem value="safety">Safety</MenuItem>
                  <MenuItem value="cleanliness">Cleanliness</MenuItem>
                  <MenuItem value="timing">Timing</MenuItem>
                  <MenuItem value="behavior">Behavior</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Route</InputLabel>
                <Select
                  name="route"
                  value={route}
                  onChange={onChange}
                  label="Route"
                >
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.routeNumber} - {route.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*,video/*"
                className={classes.fileInput}
                id="file-upload"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  className={classes.uploadButton}
                >
                  Upload Photos/Videos
                </Button>
              </label>
              {attachments.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  {attachments.length} file(s) selected
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
              >
                Submit Complaint
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ComplaintForm; 