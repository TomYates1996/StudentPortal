const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const Class = require('../models/Class');

// Create class
router.post("/create", classController.createClass);

// Add student to class
router.post("/:classId/add-students", classController.addStudentsToClass);

// Remove student from class
router.post("/:classId/remove-student", classController.removeStudentFromClass);

// Get all classes in a school
router.get("/school/:schoolId", classController.getClassesBySchool);

// Assign courses to a class
router.post("/:classId/assign-course", async (req, res) => {
    const { classId } = req.params;
    const { courseIds } = req.body;
    const ids = Array.isArray(courseIds) ? courseIds : [courseIds];
    

    try {
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $addToSet: { courses: { $each: ids } } },
            { new: true }
        ).populate("courses")
        .populate("studentIds", "name email")
        .populate("educatorId", "name email");

        res.json({ message: "Courses assigned to class", class: updatedClass });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to assign courses" });
    }
});

// Remove courses from a class
router.post("/:classId/remove-course", async (req, res) => {
    const { classId } = req.params;
    const { courseIds } = req.body; 

    try {
        const ids = Array.isArray(courseIds) ? courseIds : [courseIds];

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $pull: { courses: { $in: ids } } }, 
            { new: true }
        ).populate("courses")
        .populate("studentIds", "name email")
        .populate("educatorId", "name email");

        res.json({ message: "Courses removed from class", class: updatedClass });
    } catch (err) {
        console.error("Failed to remove course:", err);
        res.status(500).json({ message: "Failed to remove courses" });
    }
});


module.exports = router;