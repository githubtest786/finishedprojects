const express = require("express");
const categoriesLogic = require("../logic/categories-logic");
const ErrorType = require("./../errors/error-type");
const router = express.Router();

router.get("/allcategories", async (request, response) => { // Gets all categories.

    try {
        const allCategories = await categoriesLogic.getAllCategories();
        response.send (allCategories);
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
})

module.exports = router;