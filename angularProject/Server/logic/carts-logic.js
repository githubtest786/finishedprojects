const dao = require("../dao/carts-dao");
const productsDAO = require("../dao/products-dao");
const ErrorType = require("./../errors/error-type");
const cache = require("../cache/usersCache");
let ServerError = require("../errors/server-error");

async function checkIfCartAlreadyExists (token) { // Checks if a cart exists for the user.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
        throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let user_id = userCache.user_id;

    let checkIfCartExists = await dao.checkIfCartAlreadyExists(user_id);

    if (checkIfCartExists.order_date != null) {

        checkIfCartExists = {
            cart_id : checkIfCartExists.cart_id,
            creation_date : checkIfCartExists.creation_date + 1,
            order_date : checkIfCartExists.order_date + 1,
        }

    }

    else {
        checkIfCartExists = {
            cart_id : checkIfCartExists.cart_id,
            creation_date : checkIfCartExists.creation_date + 1,
        }
    }

    let cart_user_details = {
        user_id : userCache.user_id,
        first_name : userCache.first_name,
        last_name : userCache.last_name,
        username_email : userCache.username_email,
        id_number : userCache.id_number,
        password : userCache.password,
        city : userCache.city,
        street : userCache.street,
        role : userCache.role,
        cart_id : checkIfCartExists.cart_id,
    }
        
    cache.deleteData(token);
    cache.setData(token, cart_user_details);

    return (checkIfCartExists);
}

async function checkCart_createNewOne (token) { // Creates a new cart for the user if they doesn't have an available one.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let user_id = userCache.user_id;

    let checkIfCartExists = await dao.checkIfCartAlreadyExists(user_id);

    if (checkIfCartExists.creation_date == null && checkIfCartExists.order_date == null || checkIfCartExists.creation_date != null && checkIfCartExists.order_date != null) {
        let createNewCart = await dao.createNewCart(user_id);

        let cart_user_details = {
            user_id : userCache.user_id,
            first_name : userCache.first_name,
            last_name : userCache.last_name,
            username_email : userCache.username_email,
            id_number : userCache.id_number,
            password : userCache.password,
            city : userCache.city,
            street : userCache.street,
            role : userCache.role,
            cart_id : createNewCart.cart_id,
        }
            
        cache.deleteData(token);
        cache.setData(token, cart_user_details);


        return (createNewCart);
    }
    // else {
    //     throw new ServerError (ErrorType.CART_ALREADY_EXISTS.message);
    // }
    return;
}

async function getAllCartItems (token) { // Gets all cart items of the current cart.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let allCartItems = await dao.getAllCartItems(cart_id);

    return(allCartItems);
}


async function addProductToCart (product, token) { // Adds a product to the cart.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let checkProduct = await productsDAO.getProductByName(product.product_name);

    let currentProductPrice = product.price / product.amount;

    if (checkProduct.price == currentProductPrice) {
        let addProductToCart = await dao.addProductToCart(checkProduct.product_id, product, cart_id);
        return(addProductToCart);
    }
    else {
        throw new ServerError({httpCode: ErrorType.PRICE_MISMATCH.httpCode, message: ErrorType.PRICE_MISMATCH.message});
    }
}

async function updateProductInCart (product, token) { // Updates a product's values in the cart.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;
    
    let checkProduct = await productsDAO.getProductByName(product.product_name);

    let currentProductPrice = product.price / product.amount;

    
    if (checkProduct.price == currentProductPrice) {
        let addProductToCart = await dao.updateProductInCart(checkProduct.product_id, product, cart_id);
        return(addProductToCart);
    }
    else {
        throw new ServerError({httpCode: ErrorType.PRICE_MISMATCH.httpCode, message: ErrorType.PRICE_MISMATCH.message});
    }
}

async function removeProductFromCart (product, token) { // Removes a product from the cart.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let checkProduct = await productsDAO.getProductByName(product);

    if (checkProduct.product_id != null) {
        let removeProductFromCart = await dao.removeProductFromCart(checkProduct.product_id, cart_id);
        return removeProductFromCart;
    }
    else {
        throw new ServerError({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

}


async function removeAllProductsFromCart (token) { // Removes all products from the cart.

    let userCache = await cache.getData(token);

    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
    throw new ServerError({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }

    let cart_id = userCache.cart_id;

    let removeProductsFromCart = await dao.removeAllProductsFromCart(cart_id);
    return removeProductsFromCart;
}

module.exports ={
    checkIfCartAlreadyExists,
    checkCart_createNewOne,
    getAllCartItems,
    addProductToCart,
    updateProductInCart,
    removeProductFromCart,
    removeAllProductsFromCart
} 