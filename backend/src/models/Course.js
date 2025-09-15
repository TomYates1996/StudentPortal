const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },   
    courseLength: { type: Number },            
    imageUrl: { type: String },
    subject: { type: String, enum: ["computer science", "maths", "english", "history", "other"], default: "other" },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
