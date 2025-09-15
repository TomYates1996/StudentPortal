const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
        educatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // must have role=educator
        studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
