const School = require("../models/School");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerSchool = async (req, res) => {
    const { schoolName, email, password, tier } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
        }

        const school = new School({
            name: schoolName,
            tier,
            status: "inactive",
        });
        await school.save();

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const schoolAdmin = new User({
            schoolId: school._id,
            name: schoolName + " Admin",
            email,
            passwordHash,
            role: "schoolAdmin",
        });
        await schoolAdmin.save();

        res.status(201).json({ message: "School registered, awaiting payment", schoolId: school._id });
    } catch (err) {
        console.error("Register school error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.addEducator = async (req, res) => {
    const { schoolId } = req.params;
    const { name, email, password } = req.body;
    const requester = req.user; 

    try {
        if (requester.role !== 'schoolAdmin' || requester.schoolId !== schoolId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const school = await School.findById(schoolId);
        if (!school) return res.status(404).json({ message: "School not found" });

        // Count existing educators
        const educatorCount = await User.countDocuments({ schoolId, role: 'educator' });

        let maxEducators = 3; 
        if (school.tier === 'Growth') maxEducators = 10;
        if (school.tier === 'Enterprise') maxEducators = 100;

        if (educatorCount >= maxEducators) {
            return res.status(400).json({ message: `Max educators reached for ${school.tier} tier` });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const passwordHash = await bcrypt.hash(password, 10);

        const educator = new User({
            schoolId,
            name,
            email,
            passwordHash,
            role: 'educator',
            status: 'active',
        });

        await educator.save();

        res.status(201).json({ message: "Educator added successfully", educator });
    } catch (err) {
        console.error("Add educator error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get the educators for a school
exports.getEducators = async (req, res) => {
    const { schoolId } = req.params;
    const requester = req.user;

    try {
        if (requester.role !== 'schoolAdmin' || requester.schoolId !== schoolId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const educators = await User.find({ schoolId, role: 'educator' }).select('-passwordHash');
        res.json(educators);
    } catch (err) {
        console.error("Get educators error:", err);
        res.status(500).json({ message: "Server error" });
    }
};