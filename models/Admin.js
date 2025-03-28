const User = require('./User');

const adminSchema = new User.schema({
  role: { type: String, default: 'admin' },  
});

module.exports = mongoose.model('Admin', adminSchema);
