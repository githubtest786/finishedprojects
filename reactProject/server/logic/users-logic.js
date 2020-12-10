let usersDao = require("../dao/users-dao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");
const jwt = require("jsonwebtoken");
const cache = require("../cache/usersCache");
const config = require("../config.json")

async function login (user) { // login

    let username = user.username;
    let password = user.password;

    try {

        if(username.length < 3 || username.length > 20) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    
        if (password.length < 3 || password.length > 20) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }
    
        let loginUser = await usersDao.login(user);
    
        // post login
    
        let userData = {
            user_id : loginUser.user_id,
            first_name: loginUser.first_name,
            last_name : loginUser.last_name,
            username : loginUser.username,
            password : loginUser.password,
            role : loginUser.role
        }
    
        const token = jwt.sign( { sub: loginUser.username}, config.secret);
    
        cache.setData(token, userData);
    
        let response = {token: token, role: loginUser.role, first_name: loginUser.first_name};
    
        return response;

    }

    catch (error) {

        throw new ServerError ({httpCode: ErrorType.UNAUTHORIZED.httpCode, message: ErrorType.UNAUTHORIZED.message});

    }

}

async function register (user) { // register

    let firstName = user.first_name;
    let lastName = user.last_name;
    let username = user.username;
    let password = user.password;

    if (onlyLetters(firstName) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (onlyLetters(lastName) == null) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if(username.length < 3 || username.length > 20) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    if (password.length < 3 || password.length > 20) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    let registerUser = await usersDao.register(user);
    return registerUser;
}

async function allUserNames () { // Gets all usernames for better sign up experience

    let allUserNames = usersDao.allUserNames();
    return allUserNames;
}

function onlyLetters(str) { // Checks if the input is of only letters.
    return str.match("^[A-Za-z]+$");
}

module.exports = {
    login,
    register,
    allUserNames
}