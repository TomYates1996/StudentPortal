const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

// Create class
router.post("/create", classController.createClass);

// Add student to class
router.post("/add-student", classController.addStudentToClass);

// Get all classes in a school
router.get("/school/:schoolId", classController.getClassesBySchool);

module.exports = router;