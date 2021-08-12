'use strict';
const db = require('../models')
const Setting = db.setting

exports.check = () => {
    Setting.find().then(result => {
        if (result.length === 0) {
            const setting = new Setting({
                name: 'My Store',
                discount: 0,
                tax: 0
            })
            Setting(setting).save()
        }
    })
}

exports.findSingle = (req, res) => {
    Setting.find().then(result => {
        return  res.send({
            status: 'success',
            message: 'Successfully updated data!',
            data: result[0]
        })
    }).catch(error => {
        return res.send({
            status: 'failed',
            message: error.message || "Something error!"
        });
    })
}

exports.update = (req, res) => {
    const id = req.params.id

    Setting.findOneAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            if (!result) {
                return res.send({
                    status: 'failed',
                    message: 'Unable to retrieve the item!',
                });
            } else {
                return  res.send({
                    status: 'success',
                    message: 'Successfully updated data!',
                })
            }
        })
        .catch(error => {
            res.send({
                message: error.message || "Something error!"
            })
        })
}