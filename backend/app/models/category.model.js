'use strict';
const mongoose = require("mongoose");
const { Schema } = mongoose

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        name: {
            type: String,
            text: true
        },
        icon: String,
        deletedAt: Date
    }, { timestamps: true })
);

module.exports = Category;