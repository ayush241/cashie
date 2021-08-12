'use strict';
const { check } = require("express-validator");
const router = require("express").Router();

const validation = [
    check("name", "Please Enter a valid name").not().isEmpty(),
]

module.exports = app => {
    const category = require("../controllers/category.controller.js");

    router.get("/", category.findAll);
    router.post("/", validation, category.create);
    router.get("/:id", category.findById);
    router.put("/:id", validation, category.update);
    router.delete("/:id", category.delete);
    router.delete("/", category.deleteAll);
    router.delete("/delete-permanent/:id", category.deletePermanent)

    app.use("/api/category", router);
};