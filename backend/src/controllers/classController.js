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

// Add students to a class
exports.addStudentsToClass = async (req, res) => {
    try {
        const { classId } = req.params; 
        const { studentIds } = req.body; 

        const classObj = await Class.findById(classId);
        if (!classObj) return res.status(404).json({ message: "Class not found" });

        const validStudents = await User.find({
            _id: { $in: studentIds },
            schoolId: classObj.schoolId,
            role: "student",
        });

        if (validStudents.length === 0) {
            return res.status(400).json({ message: "No valid students found" });
        }

        const newIds = validStudents
            .map(s => s._id.toString())
            .filter(id => !classObj.studentIds.map(String).includes(id));

        classObj.studentIds.push(...newIds);
        await classObj.save();

        const updatedClass = await classObj.populate("studentIds", "name email").populate("courses", "title").populate("educatorId", "name email");

        res.json(updatedClass);
    } catch (err) {
        console.error("Error adding students:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Remove student from a class
exports.removeStudentFromClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { studentId } = req.body;

        const classObj = await Class.findById(classId);
        if (!classObj) {
            return res.status(404).json({ message: "Class not found" });
        }

        if (!classObj.studentIds.includes(studentId)) {
            return res.status(400).json({ message: "Student not in class" });
        }

        classObj.studentIds = classObj.studentIds.filter(
            (id) => id.toString() !== studentId
        );
        await classObj.save();

        const updatedClass = await Class.findById(classId)
        .populate("studentIds", "name email")
        .populate("courses", "title");

        res.json(updatedClass);
    } catch (err) {
        console.error("Error removing student:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get classes for a school
exports.getClassesBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const classes = await Class.find({ schoolId })
        .populate("educatorId", "name email")
        .populate("studentIds", "name email")
        .populate("courses", "title");

        res.json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error" });
    }
};
