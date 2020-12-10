const dao = require("../dao/orders-dao");
const cartsDao = require("../dao/carts-dao");
const cache = require("../cache/usersCache");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllBusyShippingDates () { // Gets all of the busy shipping dates for the calendar.
    let allOrders = await dao.getAllBusyShippingDates();

    if (allOrders[0].shipping_date == null) {
        return [{year: 0, month: 0, day: 0}];
    }

    let busyDays = new Array();

    for (let i = 0; i < allOrders.length; i++) {
        if (allOrders[i].shipping_date != null && (allOrders[i].shipping_date.getYear() != 0 && allOrders[i].shipping_date.getMonth() != 0 && allOrders[i].shipping_date.getDate() != 0)) {
            let dateToCompare = allOrders[i].shipping_date.getTime();
            let counter = 1;
            for (let j = i + 1; j < allOrders.length; j++) {
                if (allOrders[j].shipping_date != null && (allOrders[j].shipping_date.getYear() != 0 && allOrders[j].shipping_date.getMonth() != 0 && allOrders[j].shipping_date.getDate() != 0)) {
                    let anotherDate = allOrders[j].shipping_date.getTime();
                    if (anotherDate == dateToCompare) {
                        counter++;
                        allOrders[j].shipping_date.setYear(0);
                        allOrders[j].shipping_date.setMonth(0);
                        allOrders[j].shipping_date.setDate(0);
                    }
                }
            }
            if (counter >= 3) {
                let busyDay = {
                    year: allOrders[i].shipping_date.getYear() + 1900,
                    month: allOrders[i].shipping_date.getMonth() + 1,
                    day: allOrders[i].shipping_date.getDate(),
                }
                busyDays.push(busyDay);
                allOrders[i].shipping_date.setYear(0);
                allOrders[i].shipping_date.setMonth(0);
                allOrders[i].shipping_date.setDate(0);
            }
        }
    }

    return(busyDays);
}



async function updateOrder (token, order) { // Updates the order that was opened alongside a cart. Pretty much is treated as finishing an order.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
        throw new ServerError ({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let id_number = order.id_number;
    let street = order.street;

    if (onlyDigits(id_number) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }
    else {
        if (id_number.length != 9) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    }

    if (onlyLettersSpacesAndDigits(street) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    let cartProducts = await cartsDao.getAllCartItems(cart_id);

    let totalPrice = 0;

    for (let i = 0; i < cartProducts.length; i++) {
        totalPrice = totalPrice + (cartProducts[i].price);
    }

    let orderDate = new Date();
    orderDate.setHours(0,0,0,0);

    let fourCreditCardDigits = order.credit_card % 10000;

    let shippingOrder = new Date();
    shippingOrder.setFullYear(order.shipping_date.year);
    shippingOrder.setMonth(order.shipping_date.month - 1);
    shippingOrder.setDate(order.shipping_date.day);
    shippingOrder.setHours(0,0,0,0);

    let updateOrder = await dao.updateOrder(cart_id, totalPrice, order, shippingOrder, orderDate, fourCreditCardDigits);
    return updateOrder;
}

async function getReceiptDetails (token) { // Grants receipt details.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError ({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let allCartItems = await cartsDao.getAllCartItems(cart_id);

    let totalPrice = 0;
    let output = [];
    let helpingString = "";
    for (let i = 0; i < allCartItems.length; i++) {
        totalPrice = totalPrice + allCartItems[i].price;
        helpingString = {name : allCartItems[i].product_name,
            amount : allCartItems[i].amount,
            price : allCartItems[i].price};
        output.push(helpingString);
    }

    let finalMessage = {price : totalPrice};
    output.push(finalMessage);

    return output;
}

async function getAmountOfOrders () { // Gets the amount of orders done.

    let response = await dao.getAmountOfOrders();

    let finishedOrders = 0;

    for (let i = 0; i < response.length; i++) {
        if (response[i].order_date != null){
            finishedOrders++;
        }
    }

    if (response == []){
        return 0;
    }

    return(finishedOrders);
}

function onlyLettersSpacesAndDigits(str) { // Checks if the input is of only letters, spaces and digits.
    return str.match("^[ A-Za-z0-9]+$");
}

function onlyDigits(str) { // Checks if the input is of only digits.
    return str.match("^[0-9]+$");
}



module.exports = {
    getAllBusyShippingDates,
    updateOrder,
    getReceiptDetails,
    getAmountOfOrders
}