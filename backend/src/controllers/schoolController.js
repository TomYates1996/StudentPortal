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
