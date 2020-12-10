const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function createNewCart (id) { // Creates a new cart.

    let user_id = id;
    let date = new Date();
    date.setHours(0,0,0,0);
    
    let addCartSql = "INSERT INTO carts (user_id, creation_date) VALUES (?, ?)";
    let addCartResponse = await connection.executeWithParameters(addCartSql, [user_id, date]);

    let checkCartId = "SELECT cart_id from carts WHERE user_id = ?";
    let checkCartIdResponse = await connection.executeWithParameters(checkCartId, [user_id]);

    let cart_id = checkCartIdResponse[checkCartIdResponse.length-1].cart_id;

    let addOrderSql = "INSERT INTO orders (user_id, cart_id) VALUES (?, ?)"; 
    let addOrderSqlResponse = await connection.executeWithParameters(addOrderSql, [user_id, cart_id]);

    return ({cart_id : cart_id, creation_date : date});

}


async function checkIfCartAlreadyExists (id) { // Checks if an available cart already exists.

    let user_id = id;
    let checkIfCartAlreadyExistsSql = "SELECT carts.cart_id, carts.creation_date, orders.order_date FROM carts RIGHT JOIN orders ON carts.cart_id = orders.cart_id WHERE carts.user_id = ? ORDER BY carts.cart_id";
    let checkIfCartAlreadyExistsResponse = await connection.executeWithParameters(checkIfCartAlreadyExistsSql, [user_id]);

    if (checkIfCartAlreadyExistsResponse.length == 0) {
        let response = {
            creation_date : null,
            order_date : null
        }
        return(response);
    }

    return(checkIfCartAlreadyExistsResponse[checkIfCartAlreadyExistsResponse.length-1]);
}

async function getAllCartItems (cart_id) { // Gets all cart items.

    let getAllCartItemsSql = "SELECT products.product_name, cart_items.amount, cart_items.price FROM cart_items RIGHT JOIN products ON cart_items.product_id = products.product_id WHERE cart_items.cart_id = ? ORDER BY cart_items.cartitem_id";
    let getAllCartItemsResponse = await connection.executeWithParameters(getAllCartItemsSql, [cart_id]);

    return(getAllCartItemsResponse);
}

async function addProductToCart (id, product, cart) { // Adding a chosen product to a user's cart.

    let product_id = id;
    let price = product.price;
    let amount = product.amount;
    let cart_id = cart;

    let addProductSql = "INSERT INTO cart_items (product_id, price, amount, cart_id) VALUES (?, ?, ?, ?)";
    let addProductResponse = await connection.executeWithParameters(addProductSql, [product_id, price, amount, cart_id]);

    if (addProductResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

    return(addProductResponse);
}

async function updateProductInCart (id, product, cart) { // Updates the values of a chosen product in the cart.
    
    let product_id = id;
    let price = product.price;
    let amount = product.amount;
    let cart_id = cart;

    let updateProductInCartSql = "UPDATE cart_items SET price = ?, amount = ? WHERE product_id = ? AND cart_id = ?";
    let updateProductResponse = await connection.executeWithParameters(updateProductInCartSql, [price, amount, product_id, cart_id])

    if (updateProductResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }


    return(updateProductResponse);

}

async function removeProductFromCart (product, cart) { // Removing a chosen product from a user's cart.
    
    let product_id = product;
    let cart_id = cart;

    let removeProductSql = "DELETE FROM cart_items WHERE product_id = ? AND cart_id = ?";
    let removeProductResponse = await connection.executeWithParameters(removeProductSql, [product_id, cart_id]);

    if (removeProductResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

    return (removeProductResponse);
}


async function removeAllProductsFromCart (cart) {  // Removes all products from a cart.

    let cart_id = cart;

    let removeAllProductsSql = "DELETE FROM cart_items WHERE cart_id = ?";
    let removeAllProductsResponse = await connection.executeWithParameters(removeAllProductsSql, [cart_id]);

    if (removeAllProductsResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

    return (removeAllProductsResponse);
}

module.exports ={
    createNewCart,
    checkIfCartAlreadyExists,
    getAllCartItems,
    addProductToCart,
    updateProductInCart,
    removeProductFromCart,
    removeAllProductsFromCart
} 