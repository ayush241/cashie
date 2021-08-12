'use strict';
const mongoose = require("mongoose");
const { Schema } = mongoose

const Transaction = mongoose.model(
    "Transaction",
    new mongoose.Schema({
        items: [{
           type: Schema.Types.ObjectId,
           ref: 'TransactionItem'
        }],
        products: Array,
        subtotal: Number,
        discount: Number,
        tax: Number,
        grandtotal: Number
    }, { timestamps: true })
);

module.exports = Transaction;