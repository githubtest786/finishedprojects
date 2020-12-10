const expressJWT = require("express-jwt");
const config = require("../config.json");

let { secret } = config;

function authenticateJwtRequestToken() {
    return expressJWT({ secret }).unless({
        path: [
            '/api/users/login',
            '/api/products/amountofproducts',
            '/api/orders/amountoforders',
            '/api/users/signup',
            '/api/users/allids'
        ]
    });
}

module.exports = authenticateJwtRequestToken;