const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("../src/models/Course");
const Module = require("../src/models/Module");
const Lesson = require("../src/models/Lesson");

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    console.log("Old data cleared");

    const coursesData = [
      {
        title: "Intro to Algebra",
        shortDescription: "Learn the basics of algebra and equations",
        description: "This course introduces algebra for beginners.",
        price: 2000,
        courseLength: 15,
        subject: "maths",
        year: "Year 7",
      },
      {
        title: "World War II History",
        shortDescription: "Explore the events of WWII",
        description: "Covers causes, key events, and outcomes of WWII.",
        price: 2500,
        courseLength: 20,
        subject: "history",
        year: "Year 9",
      },
      {
        title: "Shakespeare’s Plays",
        shortDescription: "Dive into Shakespeare’s famous works",
        description: "Focus on Macbeth, Hamlet, and Romeo & Juliet.",
        price: 1800,
        courseLength: 12,
        subject: "english",
        year: "Year 10",
      },
      {
        title: "Python Programming",
        shortDescription: "Learn Python basics and problem solving",
        description: "Covers syntax, loops, and small projects.",
        price: 3000,
        courseLength: 30,
        subject: "computer science",
        year: "Year 11",
      },
      {
        title: "Advanced Calculus",
        shortDescription: "Deep dive into calculus for advanced students",
        description: "Limits, derivatives, integrals, and applications.",
        price: 4000,
        courseLength: 40,
        subject: "maths",
        year: "Year 13",
      },
      {
        title: "Creative Writing",
        shortDescription: "Develop your storytelling and writing skills",
        description: "Covers short stories, poems, and essays.",
        price: 2200,
        courseLength: 18,
        subject: "english",
        year: "Year 8",
      },
      {
        title: "Tech and Society",
        shortDescription: "Explore how technology impacts modern society",
        description: "Discusses AI, ethics, and digital privacy.",
        price: 3500,
        courseLength: 25,
        subject: "other",
        year: "Year 12",
      },
    ];

    for (let c of coursesData) {
      const course = new Course({ ...c, modules: [] });
      await course.save();

      for (let i = 1; i <= 3; i++) {
        const module = new Module({
          courseId: course._id,
          title: `${course.title} - Module ${i}`,
          description: `Covers part ${i} of ${course.title}`,
          order: i,
          lessons: [],
        });
        await module.save();

        for (let j = 1; j <= 3; j++) {
          const lesson = new Lesson({
            moduleId: module._id,
            title: `${module.title} - Lesson ${j}`,
            contentType: "article",
            contentUrl: `https://example.com/${course.title.toLowerCase().replace(/\s/g, "-")}/module${i}/lesson${j}`,
            order: j,
            duration: 10 + j * 5,
          });
          await lesson.save();

          module.lessons.push(lesson._id);
        }

        await module.save();
        course.modules.push(module._id);
      }

      await course.save();
      console.log(`Seeded: ${course.title}`);
    }

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
