const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    contentType: { type: String, enum: ["video", "article", "pdf"], default: "article" },
    contentUrl: { type: String },   
    order: { type: Number, default: 0 },
    duration: { type: Number },    
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
