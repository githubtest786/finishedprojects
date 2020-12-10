const expressJWT = require("express-jwt");
const config = require("../config.json");

let { secret } = config;

function authenticateJwtRequestToken() {
    return expressJWT({ secret }).unless({
        path: [
            '/api/users/login',
            '/api/users/signup',
            '/api/users/allusernames'
        ]
    });
}

module.exports = authenticateJwtRequestToken;