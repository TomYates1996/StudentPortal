const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },   
    courseLength: { type: Number, index: true },
    imageUrl: { type: String },
    subject: { type: String, enum: ["computer science", "maths", "english", "history", "other"], default: "other", index: true },
    year: { type: String, enum: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13", "other"], default: "other", index: true },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active", index: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
}, { timestamps: true });

courseSchema.index({ year: 1, subject: 1 });

module.exports = mongoose.model("Course", courseSchema);
