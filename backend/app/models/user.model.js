'use strict';
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        fullname: String,
        role: String,
        lastActive: Date,
        deletedAt: Date
}, { timestamps: true })

const User = mongoose.model(
    "User", UserSchema
)

User.collection.createIndex(
    {
            username: "text",
            fullname: "text",
    }
)

module.exports = User;