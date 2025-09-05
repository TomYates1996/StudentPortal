const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    school: { type: String, required: true },
    role: { type: String, enum: ['student', 'employee'], default: 'student' },
    message: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);