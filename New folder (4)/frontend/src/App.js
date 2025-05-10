import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import RouteList from './components/routes/RouteList';
import RouteDetail from './components/routes/RouteDetail';
import ComplaintForm from './components/complaints/ComplaintForm';
import ComplaintList from './components/complaints/ComplaintList';
import AdminDashboard from './components/admin/AdminDashboard';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/routes" component={RouteList} />
            <Route exact path="/routes/:id" component={RouteDetail} />
            <Route exact path="/complaints/new" component={ComplaintForm} />
            <Route exact path="/complaints" component={ComplaintList} />
            <Route exact path="/admin" component={AdminDashboard} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 