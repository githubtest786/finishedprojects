const dao = require("../dao/users-dao");
const ErrorType = require("./../errors/error-type");
const cache = require("../cache/usersCache");
const config = require("../config.json")
const jwt = require("jsonwebtoken");
let ServerError = require("../errors/server-error");

async function login (user) { // login

    let email = user.email;
    let password = user.password;

    if(email.slice(email.length-4) == ".com") {
        let check = email.indexOf("@");
        if (check == -1) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    }
    else {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (password.length < 3 || password.length > 20) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    let loginUser = await dao.login(user);

    // post login

    let userData = {
        user_id : loginUser.user_id,
        first_name: loginUser.first_name,
        last_name : loginUser.last_name,
        username_email : loginUser.username_email,
        id_number : loginUser.id_number,
        password : loginUser.password,
        city : loginUser.city,
        street : loginUser.street,
        role : loginUser.role
    }

    const token = jwt.sign( { sub: loginUser.username_email}, config.secret);

    cache.setData(token, userData);

    let response = {token: token, role: loginUser.role, first_name: loginUser.first_name};

    return response;
}

async function register (user) { // register

    let firstName = user.name;
    let lastName = user.lastName;
    let username = user.email + user.endingEmail;
    let id_number = user.id;
    let password = user.password;
    let city = user.city;
    let street = user.street;

    if (onlyLetters(firstName) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (onlyLetters(lastName) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if(username.slice(username.length-4) == ".com") {
        let check = username.indexOf("@");
        if (check == -1) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    }
    else {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (onlyDigits(id_number) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }
    else {
        if (id_number.length != 9) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    }

    if (password.length < 3 || password.length > 20) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (onlyLettersAndSpaces(city) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (onlyLettersSpacesAndDigits(street) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }


    let registerUser = await dao.register(user);
    return registerUser;
}

async function getUserDetails (token) { // Gets all user details for a client-sided cache.

    let userCache = await cache.getData(token);
    if (userCache == null) { // Checks if the token sent already exists in the users map. If it doesn't, the client side will force said user to login again - this deals 
    // with the issue where the server is reset, while users remain logged-in from previous sessions.
        throw new ServerError ({httpCode: ErrorType.SERVER_RESET.httpCode, message: ErrorType.SERVER_RESET.message});
    }
    let user_id = userCache.user_id;

    let userDetails = await dao.getUserDetails(user_id);
    return (userDetails);
}

async function getAllIDs () { // Gets all IDs.

    let getAllIDs = await dao.getAllIDs();
    return(getAllIDs);
}


function onlyLetters(str) { // Checks if the input is of only letters.
    return str.match("^[A-Za-z]+$");
}

function onlyLettersAndSpaces(str) { // Checks if the input is of only letters and spaces.
    return str.match("^[ A-Za-z]+$");
}

function onlyLettersSpacesAndDigits(str) { // Checks if the input is of only letters, spaces and digits.
    return str.match("^[ A-Za-z0-9]+$");
}

function onlyDigits(str) { // Checks if the input is of only digits.
    return str.match("^[0-9]+$");
}



module.exports = {
    login,
    register,
    getUserDetails,
    getAllIDs
}