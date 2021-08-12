const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose

db.user = require("./user.model")
db.category = require('./category.model')
db.product = require('./product.model')
db.transaction = require('./transaction.model')
db.setting = require('./setting.model')

module.exports = db