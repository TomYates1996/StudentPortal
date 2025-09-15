const Class = require("../models/Class");
const User = require("../models/User");

// Create a class
exports.createClass = async (req, res) => {
    try {
        const { name, schoolId, educatorId } = req.body;

        // Verify educator belongs to the school
        const educator = await User.findOne({ _id: educatorId, schoolId, role: "educator" });
        if (!educator) return res.status(400).json({ message: "Invalid educator or school mismatch" });

        const newClass = new Class({ name, schoolId, educatorId });
        await newClass.save();

        res.status(201).json(newClass);
    } catch (err) {
        console.error("Error creating class:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Add student to a class
exports.addStudentToClass = async (req, res) => {
    try {
        const { classId, studentId } = req.body;

        const classObj = await Class.findById(classId);
        if (!classObj) return res.status(404).json({ message: "Class not found" });

        // Make sure the student belongs to the same school
        const student = await User.findOne({ _id: studentId, schoolId: classObj.schoolId, role: "student" });
        if (!student) return res.status(400).json({ message: "Invalid student" });

        if (!classObj.studentIds.includes(studentId)) {
        classObj.studentIds.push(studentId);
        await classObj.save();
        }

        res.json(classObj);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get classes for a school
exports.getClassesBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const classes = await Class.find({ schoolId })
        .populate("educatorId", "name email")
        .populate("studentIds", "name email");
        res.json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error" });
    }
};