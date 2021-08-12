'use strict';
const { check } = require("express-validator");
const auth = require('../middlewares/auth')
const validation = [
    check("username", "Please Enter a valid username").not().isEmpty(),
    check("fullname", "Please Enter a valid fullname").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    }),
    check("role", "Please Enter a valid role").not().isEmpty(),
]

module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.get("/",auth, user.findAll);
    router.post("/", validation, user.create);
    router.get("/:id", user.findById);
    router.put("/:id", user.update);
    router.delete("/:id", user.deletePermanent);
    router.delete("/",auth, user.deleteAll);

    app.use("/api/user", router);
};