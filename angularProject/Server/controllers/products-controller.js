const express = require("express");
const productsLogic = require("../logic/products-logic");
const cache = require("../cache/usersCache");
const router = express.Router();
const fs = require("fs");
const uuid = require("uuid");
const ErrorType = require("./../errors/error-type");

router.get("/allproducts", async (request, response) => { // Gets all products.

    try {
        const allProducts = await productsLogic.getAllProducts();
        response.send(allProducts);
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.message);
    }
});

router.post("/addnewproduct", async (request, response) => { // Uploads the image of a product to the server.
    console.log("/New product");

    if (!fs.existsSync("../uploads")) {
        fs.mkdirSync("../uploads");
    }

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    let product = JSON.parse(request.body.details);
    let file = request.files.file;

    try {

        let addProduct = productsLogic.addProduct(token, product, file);

        response.status(200).send({product_approval : "Product added successfully!"});
    }
    catch (err) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
})

router.patch("/updateproduct", async (request, response) => { // Updates a product with new values.
    console.log("/Update product");

    if (!fs.existsSync("../uploads")) {
        fs.mkdirSync("../uploads");
    }

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {

        let product;
        let file;

        if (request.files != null) {
            file = request.files.file;
            product = JSON.parse(request.body.details);
        }
        else {
            product = request.body;
        }

        let updateProduct = await productsLogic.editProduct(token, product, file);

        response.status(200).send({product_approval : "Updated product successfully!"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/amountofproducts", async (request, response) => { // Gets the amount of different products available.

    try {
        const amountOfProducts = await productsLogic.getAmountOfProducts();
        response.send({number : amountOfProducts});
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.message);
    }
})


module.exports = router;