const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    educatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schoolIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }],
    status: {
        type: String,
        enum: ['pendingApproval', 'active', 'archived'],
        default: 'pendingApproval'
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    schedule: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
