const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);

    } catch (err) {
        console.error("Get courses error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};