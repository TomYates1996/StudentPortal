const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, schedule } = req.body;
        const newCourse = new Course({
            title,
            description,
            price,
            schedule,
            educatorId: req.user.userId
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ studentsEnrolled: req.user.userId });
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMyCreatedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ educator: req.user.id });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.enrollStudents = async (req, res) => {
    try {
        const { courseId, studentIds } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        studentIds.forEach(id => {
            if (!course.studentsEnrolled.includes(id)) {
                course.studentsEnrolled.push(id);
            }
        });

        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
