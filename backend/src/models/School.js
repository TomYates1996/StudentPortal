const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tier: { type: String, enum: ["Starter", "Growth", "Enterprise"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
}, { timestamps: true });

module.exports = mongoose.model("School", SchoolSchema);