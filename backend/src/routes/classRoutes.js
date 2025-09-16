const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const Class = require('../models/Class');

// Create class
router.post("/create", classController.createClass);

// Add student to class
router.post("/add-student", classController.addStudentToClass);

// Get all classes in a school
router.get("/school/:schoolId", classController.getClassesBySchool);

// Assign courses to a class
router.post("/:classId/assign-course", async (req, res) => {
    const { classId } = req.params;
    const { courseIds } = req.body; 

    try {
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $addToSet: { courses: { $each: courseIds } } },
            { new: true }
        ).populate("courses");

        res.json({ message: "Courses assigned to class", class: updatedClass });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to assign courses" });
    }
});

module.exports = router;