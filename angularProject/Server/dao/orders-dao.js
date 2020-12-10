const connection = require("./connection-wrapper");


async function getAllBusyShippingDates () { // Gets all busy shipping dates for the calendar.

    let allOrders = "SELECT shipping_date FROM orders";
    let ordersResponse = await connection.execute(allOrders);

    if (ordersResponse.length == "0") {
        return [];
    }

    return(ordersResponse);
}


async function updateOrder (cart_id, totalPrice, order, shippingOrder, orderDate, fourCreditCardDigits) { // Updates the order information - only for finishing it.
    
    let id = cart_id;
    let final_price = totalPrice;
    let city_for_shipping = order.city;
    let street_for_shipping = order.street;
    let shipping_date = shippingOrder;
    let order_date = orderDate;
    let credit_card_letters = fourCreditCardDigits;
    let updateOrder = "UPDATE orders SET final_price = ?, city_for_shipping = ?, street_for_shipping = ?, shipping_date = ?, order_date = ?, 4_credit_card_letters = ? WHERE cart_id = ?";
    let updateOrderResponse = await connection.executeWithParameters(updateOrder, [final_price, city_for_shipping, street_for_shipping, shipping_date, order_date, credit_card_letters, id]);

    return(updateOrderResponse);

}


async function getAmountOfOrders () { // Gets all orders done.

    let getOrdersSql = "SELECT carts.creation_date, orders.order_date FROM carts RIGHT JOIN orders ON carts.cart_id = orders.cart_id WHERE orders.cart_id is not null ORDER BY carts.cart_id";
    let response = await connection.execute(getOrdersSql);
    
    return (response);
}

module.exports = {
    getAllBusyShippingDates,
    updateOrder,
    getAmountOfOrders
}