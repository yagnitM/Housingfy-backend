const User = require('./User');

const adminSchema = new User.schema({
  role: { type: String, default: 'admin' },  // Admin role by default
});

// Optionally, add admin-specific fields or methods here if necessary

module.exports = mongoose.model('Admin', adminSchema);
