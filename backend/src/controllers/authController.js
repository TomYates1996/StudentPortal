const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const School = require("../models/School");

exports.loginSchool = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (!["schoolAdmin", "educator"].includes(user.role)) {
            return res.status(403).json({ message: "Not authorized for school login" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const school = await School.findById(user.schoolId);

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            role: user.role,
            name: user.name,
            schoolId: user.schoolId,
            email: user.email,
            schoolName: school ? school.name : "Unknown School",
        });
    } catch (err) {
        console.error("School login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (user.role !== "student") {
            return res.status(403).json({ message: "Not authorized for student login" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, schoolId: user.schoolId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, role: user.role, schoolId: user.schoolId });
    } catch (err) {
        console.error("Student login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
