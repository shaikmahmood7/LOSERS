const User = require('../models/User');

module.exports = function(roles) {
  return async function(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
}; 