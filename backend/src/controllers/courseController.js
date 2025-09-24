const Course = require('../models/Course');
const School = require('../models/School');

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

exports.getFilteredCourses = async (req, res) => {
    try {
        let { page = 1, limit = 12, year, subject, minHours, maxHours, includeOwned, schoolId } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = { status: "active" };

        if (year) filter.year = year;
        if (subject) filter.subject = subject;
        if (minHours) filter.courseLength = { ...filter.courseLength, $gte: parseInt(minHours) };
        if (maxHours) filter.courseLength = { ...filter.courseLength, $lte: parseInt(maxHours) };

        if (schoolId && includeOwned !== "true") {
            const school = await School.findById(schoolId).populate("courses");
            if (school && school.courses.length > 0) {
                filter._id = { $nin: school.courses.map(c => c._id) };
            }
        }

        const totalCourses = await Course.countDocuments(filter);
        const totalPages = Math.ceil(totalCourses / limit);

        const courses = await Course.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({ courses, totalPages, currentPage: page });
    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: "Server error" });
    }
};