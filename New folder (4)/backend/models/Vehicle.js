const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['bus', 'train', 'metro'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  currentRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  currentStop: {
    type: String,
    default: null
  },
  nextStop: {
    type: String,
    default: null
  },
  estimatedArrival: {
    type: Date,
    default: null
  },
  occupancy: {
    type: Number,
    default: 0
  },
  maintenanceHistory: [{
    date: Date,
    description: String,
    cost: Number
  }]
});

// Index for geospatial queries
vehicleSchema.index({ currentLocation: '2dsphere' });

// Update lastUpdated timestamp before saving
vehicleSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle; 