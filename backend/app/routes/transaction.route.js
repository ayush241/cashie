'use strict';
module.exports = app => {
    const transaction = require("../controllers/transaction.controller.js");

    var router = require("express").Router();

    router.get("/dashboard", transaction.fetchDashboard)
    router.get("/", transaction.findAll);
    router.post("/", transaction.create);
    router.get("/:id", transaction.findById);
    router.put("/:id", transaction.update);
    router.delete("/:id", transaction.delete);
    router.delete("/", transaction.deleteAll);

    app.use("/api/transaction", router);
};