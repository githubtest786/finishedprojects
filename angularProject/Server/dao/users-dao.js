const connection = require("./connection-wrapper");
const dbCreation = require("./dynamic-db-creation");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function login (user) { // Login function

    let email = user.email;
    let password = user.password;

    let loginSql = "SELECT * FROM users WHERE username_email =? AND password = ?";
    let loginResponse = await connection.executeWithParameters(loginSql, [email, password]);

    if (loginResponse.length == 0) {
        throw new ServerError ({httpCode: ErrorType.UNAUTHORIZED.httpCode, message: ErrorType.UNAUTHORIZED.message});
    }
    return (loginResponse[0]);

}

async function register (user) { // Signup function

    console.log(user);

    let first_name = user.name;
    let last_name = user.lastName;
    let username_email = user.email + user.endingEmail;
    let id_number = user.id;
    let password = user.password;
    let city = user.city;
    let street = user.street;

    let signUpSql = "INSERT INTO users (first_name, last_name, username_email, id_number, password, city, street) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let signUpResponse = await connection.executeWithParameters(signUpSql, [first_name, last_name, username_email, id_number, password, city, street]);

    if (signUpResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    return (signUpResponse[0]);
}

async function getUserDetails (user_id) { // Gets all user details for a client-sided cache.


    let getDetailsSql = "SELECT username_email, id_number, password, city, street, first_name, last_name, role FROM users WHERE user_id = ?";
    let response = await connection.executeWithParameters(getDetailsSql, [user_id]);

    if (response.length == 0) {
        throw new ServerError ({httpCode: ErrorType.UNAUTHORIZED.httpCode, message: ErrorType.UNAUTHORIZED.message});
    }

    return (response);
}

async function getAllIDs () { // Gets all IDs to make a better sign up experience.

    let getIDs = "SELECT id_number FROM users";
    let response = await connection.execute(getIDs);

    return(response);
}

module.exports = {
    login,
    register,
    getUserDetails,
    getAllIDs
}