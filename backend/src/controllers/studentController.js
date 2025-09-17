const User = require("../models/User");
const Class = require("../models/Class");
const School = require("../models/School");
const bcrypt = require("bcryptjs");

// Create new student
exports.createStudent = async (req, res) => {
    try {
        const { name, email, password, schoolId, classId } = req.body;
        const requester = req.user; 

        if (!["schoolAdmin", "educator"].includes(requester.role)) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        const studentCount = await User.countDocuments({ schoolId, role: "student" });

        let limit;
        switch (school.tier) {
            case "Starter":
                limit = 20;
                break;
            case "Growth":
                limit = 100;
                break;
            case "Enterprise":
                limit = 1000;
                break;
            default:
                limit = 0;
        }

        if (studentCount >= limit) {
            return res.status(403).json({ 
                message: `Student limit reached for ${school.tier} tier. Max allowed: ${limit}` 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new User({
            name,
            email,
            passwordHash: hashedPassword,
            role: "student",
            schoolId,
        });

        await newStudent.save();

        if (classId) {
            const classObj = await Class.findById(classId);
            if (classObj) {
                classObj.studentIds.push(newStudent._id);
                await classObj.save();
            }
        }

        res.status(201).json({
            message: "Student created successfully",
            student: {
                id: newStudent._id,
                name: newStudent.name,
                email: newStudent.email,
                role: newStudent.role,
            },
        });
    } catch (err) {
        console.error("Create student error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all students in school
exports.getStudentsBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const students = await User.find({ schoolId, role: "student" });
        res.json(students);
    } catch (err) {
        console.error("Get students error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.registerStudent = async (req, res) => {
    const { name, email, password, schoolId, createdById } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const student = new User({
            name,
            email,
            passwordHash,
            role: "student",
            schoolId,
            createdById 
        });

        await student.save();
        res.status(201).json({ message: "Student registered successfully", studentId: student._id });
    } catch (err) {
        console.error("Student registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
