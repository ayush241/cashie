'use strict';
module.exports = app => {
    const setting = require("../controllers/setting.controller.js");

    var router = require("express").Router();

    router.get("/", setting.findSingle);
    router.put("/:id", setting.update);

    app.use("/api/setting", router);
};