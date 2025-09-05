const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['educator']),
    courseController.createCourse
);

router.post(
    '/enroll',
    authMiddleware,
    roleMiddleware(['schoolAdmin']),
    courseController.enrollStudents
);

router.get(
    '/my',
    authMiddleware,
    roleMiddleware(['student']),
    courseController.getMyCourses
);

router.get(
    '/my-created',
    authMiddleware,
    roleMiddleware(['educator']),
    courseController.getMyCreatedCourses
);

module.exports = router;
