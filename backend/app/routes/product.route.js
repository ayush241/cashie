'use strict';
const { check } = require("express-validator");
const multer = require("multer");

const admin=require('../middlewares/admin')
const validation = [
    check("name", "Please Enter a valid name").not().isEmpty(),
    check("price", "Please Enter a valid price").not().isEmpty(),
]


module.exports = app => {
    const product = require("../controllers/product.controller.js");
    const FILE_PATH = 'app/uploads/product/';
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, FILE_PATH),
        filename: (req, file, cb) => {
            const fileName = file.originalname.toLowerCase().split(' ').join('-');
            cb(null, `${Math.floor(Math.random() * 10000)}-${fileName}`);
        },
    });
    const upload = multer({
        storage: storage
    }).single('image')

    var router = require("express").Router();

    router.get("/transaction", product.findTransactionProduct);
    router.get("/", product.findAll);
    router.post("/", upload, validation, product.create);
    router.get("/:id", product.findById);
    router.put("/:id", upload, validation, product.update);
    router.delete("/:id",admin, product.delete);
    router.delete("/delete-permanent/:id",admin, product.deletePermanent)
    router.delete("/",admin, product.deleteAll);

    app.use("/api/product", router);
};