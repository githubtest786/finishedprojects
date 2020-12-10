const express = require("express");
const ordersLogic = require("../logic/orders-logic");
const cache = require("../cache/usersCache");
const ErrorType = require("./../errors/error-type");
const router = express.Router();

router.get("/getallbusyshippingdates", async (request, response) => { // Gets all busy shipping dates for the calendar.
    console.log("/All busy shipping dates");

    try {
        const allOrders = await ordersLogic.getAllBusyShippingDates();
        let products = JSON.stringify(allOrders);
        response.send(products);
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.message);
    }
});

router.patch("/ordernow", async (request, response) => { // Orders the current cart.
    console.log("/Order now");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);
    let order = request.body;

    try {
        const updateOrderWithDate = await ordersLogic.updateOrder(token, order);
        response.status(200).send({order_approval : "Ordered successfully."});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/receipt", async (request, response ) => { // Sends back the details of the receipt.
    console.log("/Receipt")

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    try {
        const getReceipt = await ordersLogic.getReceiptDetails(token);
        let receipt = getReceipt;
        response.status(200).send(receipt);
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/amountoforders", async (request, response) => { // Gets the amount of orders done.

    try {
        const amountOfOrders = await ordersLogic.getAmountOfOrders();
        response.send({number : amountOfOrders});
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.message);
    }
})


module.exports = router;