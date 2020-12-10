const express = require("express");
const cartsLogic = require("../logic/carts-logic");
const cache = require("../cache/usersCache");
const ErrorType = require("./../errors/error-type");
const router = express.Router();

router.get("/cartexists", async (request, response) => { // Checks if a cart exists.
    console.log("/Check cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {
        const currentCart = await cartsLogic.checkIfCartAlreadyExists(token);

        response.status(201).send({creation_date : currentCart.creation_date, order_date : currentCart.order_date});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.post("/opennewcart", async (request, response) => { // Creates a new cart if a cart doesn't already exist for the user.
    console.log("/Create new cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {
        const openNewCart = await cartsLogic.checkCart_createNewOne(token);

        response.status(200).send({creation_date : openNewCart.creation_date, order_date : null});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/getallcartitems", async (request, response) => { // Gets all cart items of the current cart.
    console.log("/Getting cart items");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {
        const allCartItems = await cartsLogic.getAllCartItems(token);
        response.status(200).send(allCartItems);
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.post("/addnewproducttocart", async (request, response) => { // Adds a new product to the cart.
    console.log("/Add new product to cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);
    let product = request.body;

    try {
        const addNewProductToCart = await cartsLogic.addProductToCart(product, token);
        response.status(200).send({product_approval : "Product added to cart"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.patch("/updateproductincart", async (request, response) => { // Updates the product values in the cart.
    console.log("/Update product in cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);
    let product = request.body;

    try {
        const addNewProductToCart = await cartsLogic.updateProductInCart(product, token);
        response.status(200).send({product_approval : "Product updated in cart"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.delete("/removeproductfromcart/:product", async (request, response) => { // Removes a product from the cart.
    console.log("/Remove product from cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);
    let product = request.params.product;

    try {
        const removeProductFromCart = await cartsLogic.removeProductFromCart(product, token);
        response.status(200).send({product_approval : "Product deleted from cart"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.delete("/clearcart", async (request, response) => { // Clears the cart entirely.
    console.log("/Remove all products from cart");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {
        const removeAllProductsFromCart = await cartsLogic.removeAllProductsFromCart(token);
        response.status(200).send({product_approval : "Cart cleared successfully!"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

module.exports = router;