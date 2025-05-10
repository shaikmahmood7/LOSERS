const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Route = require('../models/Route');

// @route   GET api/routes
// @desc    Get all routes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ routeNumber: 1 });
    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/routes/:id
// @desc    Get route by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/routes
// @desc    Create a route
// @access  Private (Admin only)
router.post('/', [
  check('routeNumber', 'Route number is required').not().isEmpty(),
  check('name', 'Route name is required').not().isEmpty(),
  check('type', 'Transport type is required').isIn(['bus', 'train', 'metro']),
  check('stops', 'At least one stop is required').isArray({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRoute = new Route(req.body);
    const route = await newRoute.save();
    res.json(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/routes/:id
// @desc    Update a route
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/routes/:id
// @desc    Delete a route
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.json({ msg: 'Route removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Route not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/routes/nearby
// @desc    Get routes near a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    const routes = await Route.find({
      'stops.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 