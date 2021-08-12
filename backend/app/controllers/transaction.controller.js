'use strict';
const db = require('../models')
const Transaction = db.transaction
const { DefaultSort } = require('../constants/sort');
const moment = require('moment')

// Get all data
exports.findAll  = (req, res) => {
    // Sort : old, new
    // Filter : start date, end date, page, limit
    const { start, end, sort, page, limit } = req.query
    const startDate = moment(new Date(start)).startOf('day')
    const endDate = moment(new Date(end)).endOf('day')
    let aggregate = []

    if (start && end) {
        aggregate.push({
            "$match": {
                "createdAt": {
                    "$gte": new Date(startDate.format()),
                    "$lte": new Date(endDate.format())
                }
            }
        })
    }

    if (sort) {
        let sorts = {}
        let sortBy = { 'createdAt': 1 }
        sortBy['createdAt'] = sort['newest'] ? -1 : 1
        switch (sort) {
            case DefaultSort.NEWEST:
                sortBy['createdAt'] = -1
                break
            case DefaultSort.OLDEST:
                sortBy['createdAt'] = 1
                break
            default:
                return;
        }

        sorts['$sort'] = sortBy
        aggregate.push(sorts)
    }

    aggregate.push({ "$skip": page ? limit * page : 0 })
    aggregate.push({ "$limit": parseInt(limit) })

    Transaction.aggregate(aggregate)
        .then(result => {
            Transaction.countDocuments().then(count => {
                const lastPage = Math.ceil(count/limit) - 1
                const data = {
                    transactions: result,
                    pagination: {
                        perPage: limit,
                        page,
                        lastPage: parseInt(page) === lastPage
                    }
                }
                res.send({
                    status: 'success',
                    message: 'Successfully fetch data!',
                    data
                })
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};

// Create new data
exports.create = async (req, res) => {
    let requestBody = req.body
    requestBody.products = requestBody.items
    const transaction = new Transaction(req.body)
    transaction.save(transaction)
        .then(result => {
            if (result) {
                res.send({
                    status: 'success',
                    message: 'Successfully added data!',
                    data: result
                })
            }
        })
};

// Get single data
exports.findById = (req, res) => {
    const id = req.params.id;

    Transaction.findById(id)
        .populate('items')
        .then(result => {
            res.send({
                status: 'success',
                message: 'Successfully get a data!',
                data: result
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};

// Update data
exports.update = (req, res) => {
    const id = req.params.id;

    Transaction.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.status(404).send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                res.send({
                    status: 'success',
                    message: 'Successfully updated data!',
                    data: result
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        });
};

// Delete data
exports.delete = (req, res) => {
    const id = req.params.id;

    Transaction.findById(id)
        .populate('items')
        .then(transaction => {
            res.send(transaction)
        })
};

// Delete all data
exports.deleteAll = (req, res) => {
    Transaction.deleteMany({})
        .then(result => {
            res.send({
                status: 'success',
                message: 'Successfully deleted all data!',
            })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};

// Get data for dashboard
exports.fetchDashboard = (req, res) => {
    // Filter : start date, end date
    const { start, end } = req.query
    const startDate = moment(new Date(start)).startOf('day')
    const endDate = moment(new Date(end)).endOf('day')
    let aggregate = []

    if (start && end) {
        aggregate.push({
            "$match": {
                "createdAt": {
                    "$gte": new Date(startDate.format()),
                    "$lte": new Date(endDate.format())
                }
            }
        })
    }

    aggregate.push({
        "$facet": {
            "products": [
                { "$unwind": "$products" },
                { "$group": {
                        _id: '',
                        qty: { "$sum": "$products.qty" }
                    }
                }
            ],
            "transactions": [
                {
                    "$project": {
                        _id: "$_id",
                        grandtotal: "$grandtotal",
                        createdAt: "$createdAt"
                    },
                },
                {
                    "$group": {
                        _id: { $dateToString: { format: "%w", date: "$createdAt" }},
                        grandtotal: { "$sum": "$grandtotal" }
                    }
                }
            ],
            "all": [
                {
                    "$group": {
                        _id: '',
                        total: { "$sum": "$grandtotal" },
                        count: { "$sum": 1 },
                    }
                }
            ],
        }
    })

    Transaction.aggregate(aggregate).then(result => {
        const data = result[0]

        res.send({
            status: 'success',
            message: 'Successfully fetch data!',
            data: {
                count: data.all.length !== 0 ? data.all[0].count : 0,
                total: data.all.length !== 0 ? data.all[0].total : 0,
                qty: data.products.length !== 0 ? data.products[0].qty : 0,
                items: data.transactions
            }
        })
    })
}