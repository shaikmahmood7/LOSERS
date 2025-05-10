const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  stops: [{
    name: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    estimatedTime: Number, // in minutes from start
    isTerminal: {
      type: Boolean,
      default: false
    }
  }],
  schedule: [{
    departureTime: {
      type: String,
      required: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  type: {
    type: String,
    enum: ['bus', 'train', 'metro'],
    required: true
  },
  fare: {
    base: {
      type: Number,
      required: true
    },
    perStop: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
routeSchema.index({ 'stops.location': '2dsphere' });

// Update the updatedAt timestamp before saving
routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route; 