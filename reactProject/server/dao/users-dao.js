const connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");
const dbCreation = require("./db-creation");

async function login (user) { // Login function

    let username = user.username;
    let password = user.password;

    let loginSql = "SELECT * FROM users WHERE username = ? AND password = ?";
    let loginResponse = await connection.executeWithParameters(loginSql, [username, password]);

    if (loginResponse.length == 0) {
        throw new ServerError ({httpCode: ErrorType.UNAUTHORIZED.httpCode, message: ErrorType.UNAUTHORIZED.message});
    }
    return (loginResponse[0]);

}

async function register (user) { // Signup function

    let first_name = user.first_name;
    let last_name = user.last_name;
    let username = user.username;
    let password = user.password;

    let signUpSql = "INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)";
    let signUpResponse = await connection.executeWithParameters(signUpSql, [first_name, last_name, username, password]);

    if (signUpResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    return (signUpResponse[0]);
}

async function allUserNames () {// Gets all usernames for better sign up experience

    let allUserNamesSql = "SELECT username FROM users";
    let allUserNamesResponse = await connection.execute(allUserNamesSql);

    return allUserNamesResponse;
}

module.exports = {
    login,
    register,
    allUserNames
}