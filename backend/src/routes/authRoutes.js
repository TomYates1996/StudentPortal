const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// School login (admins + educators)
router.post("/school/login", authController.loginSchool);

// Student login
router.post("/student/login", authController.loginStudent);

module.exports = router;
