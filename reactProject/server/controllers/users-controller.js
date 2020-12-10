let usersLogic = require("../logic/users-logic");
const express = require("express");
const config = require("../config.json")
const jwt = require("jsonwebtoken");
const cache = require("../cache/usersCache");
const ErrorType = require("./../errors/error-type");

const router = express.Router();

router.post("/login", async (request, response) => { // login
    console.log("/Login");

    try {
        let user = request.body;

        const loginUser = await usersLogic.login(user);

        response.send({token : loginUser.token, userType: loginUser.role, name: loginUser.first_name});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.post("/signup", async (request, response) => { // sign up
    console.log("/Signup");

    try {
        let user = request.body;

        const registerUser = await usersLogic.register(user);
        response.status(201).json({"signup_approval" : "Registered successfully!"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/allusernames", async (request, response) => { // Gets all usernames for better sign up experience
    console.log("/All usernames");

    try {
        const allUserNames = await usersLogic.allUserNames();
        response.status(200).send(allUserNames);
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.GENERAL_ERROR.message);
    }
});

router.get("/getuserrole", async (request, response) => { // Gets a user's role incase they were already logged in before and re-entered.
    console.log("/Getting role");

    let authorizationString = request.headers["authorization"];
    let token = authorizationString.substring("Bearer ".length);

    try {
        let userCache = await cache.getData(token);
        response.status(200).send({userType: userCache.role});
    }
    catch (error) {
        response.status(ErrorType.SERVER_RESET.httpCode).send(ErrorType.SERVER_RESET.message);
    }

});


module.exports = router;