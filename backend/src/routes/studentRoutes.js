const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { createStudent, getStudentsBySchool } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", studentController.registerStudent);

// Create new student 
router.post("/create", authMiddleware, createStudent);

// Get all students in school
router.get("/school/:schoolId", authMiddleware, getStudentsBySchool);

module.exports = router;