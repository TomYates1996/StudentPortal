const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
