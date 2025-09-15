const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("../src/models/Course");
const Module = require("../src/models/Module");
const Lesson = require("../src/models/Lesson");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});

    const course = await Course.create({
        title: "Intro to Data Science",
        shortDescription: "A beginner-friendly dive into data science basics.",
        description: "Learn Python, statistics, and basic ML concepts in this structured course.",
        price: 4999, 
        courseLength: 20,
        imageUrl: "/student-portal-logo.png",
        subject: "computer science",
        status: "active"
    });

    const module1 = await Module.create({
        courseId: course._id,
        title: "Getting Started with Python",
        description: "Setup and basics",
        order: 1,
    });

    const module2 = await Module.create({
        courseId: course._id,
        title: "Statistics Fundamentals",
        description: "Mean, median, mode, variance",
        order: 2,
    });

    const lesson1 = await Lesson.create({
            moduleId: module1._id,
            title: "Installing Python & Jupyter",
            contentType: "video",
            contentUrl: "https://example.com/python-setup-video",
            order: 1,
            duration: 15
    });

    const lesson2 = await Lesson.create({
            moduleId: module2._id,
            title: "Descriptive Statistics",
            contentType: "article",
            contentUrl: "https://example.com/stats-article",
            order: 1,
            duration: 25
    });

    module1.lessons.push(lesson1._id);
    await module1.save();

    module2.lessons.push(lesson2._id);
    await module2.save();

    course.modules.push(module1._id, module2._id);
    await course.save();

    process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
