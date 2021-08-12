'use strict';
const mongoose = require("mongoose")
const { Schema } = mongoose

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        name: {
            type: String,
            text: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        image: {},
        description: String,
        price: String,
        deletedAt: Date
    }, { timestamps: true })
);

module.exports = Product;