const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/index', courseController.getCourses);

router.get('/:id', courseController.getCourseById);

module.exports = router;
