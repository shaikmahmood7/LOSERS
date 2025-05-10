import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Button,
  Chip,
  makeStyles,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  addButton: {
    marginBottom: theme.spacing(3),
  },
}));

const statusColors = {
  pending: 'default',
  in_progress: 'primary',
  resolved: 'success',
  rejected: 'error',
};

const ComplaintList = () => {
  const classes = useStyles();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    // TODO: Fetch complaints from API
    const mockComplaints = [
      {
        id: 1,
        title: 'Late Bus',
        type: 'timing',
        status: 'pending',
        createdAt: '2024-03-10T10:00:00Z',
        route: { routeNumber: '101', name: 'Downtown Express' },
      },
      {
        id: 2,
        title: 'Dirty Train',
        type: 'cleanliness',
        status: 'in_progress',
        createdAt: '2024-03-09T15:30:00Z',
        route: { routeNumber: '202', name: 'Metro Line 1' },
      },
      {
        id: 3,
        title: 'Rude Driver',
        type: 'behavior',
        status: 'resolved',
        createdAt: '2024-03-08T09:15:00Z',
        route: { routeNumber: '303', name: 'Train Route A' },
      },
    ];
    setComplaints(mockComplaints);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedComplaints = complaints.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'createdAt') {
      return isAsc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return isAsc
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/complaints/new"
            className={classes.addButton}
          >
            New Complaint
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'title'}
                        direction={orderBy === 'title' ? order : 'asc'}
                        onClick={() => handleSort('title')}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'type'}
                        direction={orderBy === 'type' ? order : 'asc'}
                        onClick={() => handleSort('type')}
                      >
                        Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'createdAt'}
                        direction={orderBy === 'createdAt' ? order : 'asc'}
                        onClick={() => handleSort('createdAt')}
                      >
                        Created At
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedComplaints
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((complaint) => (
                      <TableRow
                        key={complaint.id}
                        hover
                        component={RouterLink}
                        to={`/complaints/${complaint.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <TableCell>{complaint.title}</TableCell>
                        <TableCell>
                          {complaint.type.charAt(0).toUpperCase() +
                            complaint.type.slice(1)}
                        </TableCell>
                        <TableCell>
                          {complaint.route.routeNumber} - {complaint.route.name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.status
                              .split('_')
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(' ')}
                            color={statusColors[complaint.status]}
                            size="small"
                            className={classes.statusChip}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(complaint.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={complaints.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComplaintList; 