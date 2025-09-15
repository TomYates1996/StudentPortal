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