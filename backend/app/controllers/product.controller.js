'use strict';
const { validationResult }  = require('express-validator');
const {ObjectId} = require('mongodb');
const fs = require('fs')
const db = require('../models')
const Product = db.product
const Category = db.category
const imagePath = './app/uploads/product/'
const { ProductSort }  = require("../constants/sort");

// Get all data
exports.findAll  = (req, res) => {
    // Sort : old, new, name, price
    // Filter : keyword, page, group, limit
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
        let sorts = { '$sort': {} }
        switch (sort) {
            case ProductSort.NEWEST:
                sorts['$sort']['createdAt'] = -1
                break
            case ProductSort.OLDEST:
                sorts['$sort']['createdAt'] = 1
                break
            case ProductSort.NAME:
                sorts['$sort']['name'] = 1
                break
            case ProductSort.LOW_TO_HIGH:
                sorts['$sort']['price'] = 1
                break
            case ProductSort.HIGH_TO_LOW:
                sorts['$sort']['price'] = -1
                break
            default:
                return;
        }
        aggregate.push(sorts)
    }

    aggregate.push({ "$skip": page ? limit * page : 0 })
    aggregate.push({ "$limit": parseInt(limit) })
    aggregate.push({
        "$lookup": {
            from: Category.collection.name,
            localField: 'category',
            foreignField: '_id',
            as: 'category'
        },
    })

    Product.aggregate(aggregate).then(result => {
        Product.countDocuments({ 'deletedAt': { '$exists': false } }).then(count => {
            const lastPage = Math.ceil(count/limit) - 1
            const data = {
                products: result,
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

// Get products for transaction
exports.findTransactionProduct  = (req, res) => {
    // Sort : old, new, name, price
    // Filter : page, limit
    const { page, limit } = req.query
    let aggregate = []

    aggregate.push({
        "$match": { 'deletedAt': { '$exists': false } }
    })
    aggregate.push({
        "$lookup": {
            from: Category.collection.name,
            localField: 'category',
            foreignField: '_id',
            as: 'category'
        },
    })

    aggregate.push({
        "$sort": { name: 1 }
    })
    aggregate.push({ "$unwind": '$category' })
    aggregate.push({
        "$group": {
            _id: '$category._id',
            name: {
                "$first": "$category.name"
            },
            items: {
                "$push": {
                    _id: '$_id',
                    name: '$name',
                    price: '$price',
                    image: '$image'
                }
            }
        }
    })
    aggregate.push({
        "$sort": { name: 1 }
    })

    Product.aggregate(aggregate).then(result => {
        Product.find({ 'deletedAt': { '$exists': false } }).then(all => {
            const lastPage = Math.ceil(all.length/limit) - 1
            const data = {
                all: all,
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
            res.status(500).send({
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
    const url = req.protocol + '://' + req.get('host') + '/product/'
    let params = req.body
    if (req.file) params.image = url + req.file.filename
    if (params.category) params.category = ObjectId(params.category)

    const product = new Product(params);
    product
        .save(product)
        .then(result => {
            return res.send({
                status: 'success',
                message: 'Successfully added data!',
                data: result
            })
        })
        .catch(error => {
            return res.status(500).send({
                message: error.message || "Something error!"
            })
        })
};

// Get single data
exports.findById = (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .populate('categories')
        .then(result => {
            return res.send({
                status: 'success',
                message: 'Successfully get a data!',
                data: result
            })
        })
        .catch(error => {
            return res.status(500).send({
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
    const url = req.protocol + '://' + req.get('host') + '/product/'
    let params = req.body
    if (req.file) params.image = url + req.file.filename
    if (params.category) params.category = ObjectId(params.category)

    const product = new Product(params);

    Product.findByIdAndUpdate(id, params, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                res.status(404).send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                if (result.image) {
                    const image = result.image.split('/')
                    const imageUrl = imagePath + image[image.length - 1]

                    fs.stat(imageUrl, (err, stat) => {
                        if (stat) {
                            fs.unlink(imageUrl, (err) => {
                                if (err) {
                                    res.send({
                                        status: 'failed',
                                        message: 'Failed to save image!',
                                    });
                                }
                            })
                        }
                    })
                }

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

// Delete permanent data
exports.deletePermanent = (req, res) => {
    const id = req.params.id;

    Product.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                res.send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                res.send({
                    status: 'success',
                    message: 'Successfully deleted permanent data!',
                })
            }
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "Something error!"
            })
        });
};

// Delete temporary data
exports.delete = (req, res) => {
    const id = req.params.id;

    Product.findByIdAndUpdate(
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
    Product.deleteMany({})
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