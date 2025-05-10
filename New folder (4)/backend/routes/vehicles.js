const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');

// @route   GET api/vehicles
// @desc    Get all vehicles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('driver', 'name')
      .populate('currentRoute', 'routeNumber name');
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('driver', 'name')
      .populate('currentRoute', 'routeNumber name');
    
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/vehicles
// @desc    Create a vehicle
// @access  Private (Admin only)
router.post('/', [
  check('vehicleNumber', 'Vehicle number is required').not().isEmpty(),
  check('type', 'Vehicle type is required').isIn(['bus', 'train', 'metro']),
  check('capacity', 'Capacity is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newVehicle = new Vehicle(req.body);
    const vehicle = await newVehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/vehicles/:id
// @desc    Update vehicle
// @access  Private (Admin/Driver)
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    // Update vehicle location and status
    const { currentLocation, status, occupancy, currentStop, nextStop, estimatedArrival } = req.body;
    
    if (currentLocation) {
      vehicle.currentLocation = currentLocation;
    }
    if (status) {
      vehicle.status = status;
    }
    if (occupancy !== undefined) {
      vehicle.occupancy = occupancy;
    }
    if (currentStop) {
      vehicle.currentStop = currentStop;
    }
    if (nextStop) {
      vehicle.nextStop = nextStop;
    }
    if (estimatedArrival) {
      vehicle.estimatedArrival = estimatedArrival;
    }

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles/nearby
// @desc    Get vehicles near a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    const vehicles = await Vehicle.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).populate('currentRoute', 'routeNumber name');

    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/vehicles/:id/maintenance
// @desc    Add maintenance record
// @access  Private (Admin only)
router.post('/:id/maintenance', [
  check('description', 'Description is required').not().isEmpty(),
  check('cost', 'Cost is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    vehicle.maintenanceHistory.push({
      date: new Date(),
      description: req.body.description,
      cost: req.body.cost
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 