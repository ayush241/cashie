'use strict';
const { validationResult }  = require('express-validator');
const { CategorySort }  = require("../constants/sort");
const db = require('../models')
const Category = db.category

// Get all data
exports.findAll  = (req, res) => {
    // Sort : old, new, name
    // Filter : keyword, page, limit
    const { keyword, sort, page, limit } = req.query
    let aggregate = []

    let matches = {}
    let match = {
        'deletedAt': { '$exists': false }
    }
    if (keyword) match["$text"] = {"$search": keyword}
    matches['$match'] = match
    aggregate.push(matches)

    if (sort) {
        let sorts = {
            '$sort': {}
        }
        switch (sort) {
            case CategorySort.NEWEST:
                sorts['$sort']['createdAt'] = -1
                break
            case CategorySort.OLDEST:
                sorts['$sort']['createdAt'] = 1
                break
            case CategorySort.NAME:
                sorts['$sort']['name'] = 1
                break
            default:
                return;
        }
        aggregate.push(sorts)
    }

    if (limit) {
        aggregate.push({ "$skip": page ? limit * page : 0 })
        aggregate.push({ "$limit": parseInt(limit) })
    }
    aggregate.push({
        "$lookup": {
            from: Category.collection.name,
            localField: 'parent',
            foreignField: '_id',
            as: 'parent'
        }
    })

    Category.aggregate(aggregate).then(result => {
        Category.countDocuments({ 'deletedAt': { '$exists': false } }).then(count => {
            const lastPage = Math.ceil(count/limit) - 1
            const data = {
                categories: result,
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
            res.send({
                message: error.message || "Something error!"
            })
        })
};

// Create new data
exports.create = (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.send({
            status: 'failed',
            message: err,
        })
    }
    const requestBody = req.body;
    const category = new Category({
        parent: requestBody.parent,
        name: requestBody.name
    });

    category
        .save(category)
        .then(result => {
            return res.send({
                status: 'success',
                message: 'Successfully added data!',
                data: result
            })
        })
        .catch(error => {
            return res.send({
                message: error.message || "Something error!"
            })
        })
};

// Get single data
exports.findById = (req, res) => {
    const id = req.params.id;

    Category.findById(id).populate('parent')
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
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.send({
            status: 'failed',
            message: err,
        })
    }

    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                res.send({
                    status: 'success',
                    message: 'Successfully updated data!',
                })
            }
        })
        .catch(error => {
            res.send({
                message: error.message || "Something error!"
            })
        });
};

// Delete permanent data
exports.deletePermanent = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                res.send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                Category.deleteMany({
                    parent: result._id
                }).then(() => {
                    res.send({
                        status: 'success',
                        message: 'Successfully deleted data!',
                    })
                })
            }
        })
        .catch(error => {
            res.send({
                message: error.message || "Something error!"
            })
        });
}

// Delete temporary data
exports.delete = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndUpdate(
                id,
        { deletedAt: new Date()},
        { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                res.send({
                    status: 'success',
                    message: 'Successfully deleted data!',
                })
            }
        })
        .catch(error => {
            res.send({
                message: error.message || "Something error!"
            })
        });
};

// Delete all data
exports.deleteAll = (req, res) => {
    Category.deleteMany({})
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