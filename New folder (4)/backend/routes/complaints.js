const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @route   GET api/complaints
// @desc    Get all complaints
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('route', 'routeNumber name')
      .populate('vehicle', 'vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/complaints/user/:userId
// @desc    Get complaints by user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.params.userId })
      .populate('route', 'routeNumber name')
      .populate('vehicle', 'vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/complaints
// @desc    Create a complaint
// @access  Private
router.post('/', [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('type', 'Valid complaint type is required').isIn(['safety', 'cleanliness', 'timing', 'behavior', 'other'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newComplaint = new Complaint({
      ...req.body,
      user: req.user.id
    });

    const complaint = await newComplaint.save();
    
    // Notify admin users about new complaint
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await admin.addNotification('complaint_update', `New complaint: ${complaint.title}`);
    }

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/complaints/:id
// @desc    Update complaint status
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    const { status, response } = req.body;
    
    if (status) {
      complaint.status = status;
    }

    if (response) {
      complaint.responses.push({
        responder: req.user.id,
        message: response
      });

      // Notify user about the response
      const user = await User.findById(complaint.user);
      if (user) {
        await user.addNotification(
          'complaint_update',
          `Your complaint "${complaint.title}" has been updated`
        );
      }
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/complaints/stats
// @desc    Get complaint statistics
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgResponseTime: {
            $avg: {
              $subtract: [
                { $arrayElemAt: ['$responses.timestamp', 0] },
                '$createdAt'
              ]
            }
          }
        }
      }
    ]);

    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      byType: stats,
      byStatus: statusStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 