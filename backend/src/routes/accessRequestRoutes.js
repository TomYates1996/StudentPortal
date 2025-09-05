const express = require('express');
const router = express.Router();
const AccessRequest = require('../models/AccessRequest');

router.post('/', async (req, res) => {
    try {
        const { name, email, school, role, message } = req.body;
        const request = new AccessRequest({ name, email, school, role, message });
        await request.save();
        res.status(201).json({ msg: 'Access request submitted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error.' });
    }
});

module.exports = router;
