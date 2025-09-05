const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["student", "educator", "schoolAdmin"], 
        required: true 
    },
    educatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);