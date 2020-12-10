const express = require("express");
const usersLogic = require("../logic/users-logic");
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

router.get("/getuserdetails", async (request, response) => { // Gets all user details - used for a client sided cache.
    console.log("/Getting user details");

    try {

        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);

        const userDetails = await usersLogic.getUserDetails(token);

        response.status(200).send({id_number : userDetails[0].id_number, city : userDetails[0].city,street : userDetails[0].street, first_name : userDetails[0].first_name, 
            last_name : userDetails[0].last_name, role : userDetails[0].role});
        }
    catch (error) {
        // console.log(error);
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.get("/allids", async (request, response) => { // Gets all ID numbers to make a more pleasant signing up process - not talking about mysql table ids, but identification numbers.
    console.log("/All IDs");

    try {
        const getIDs = await usersLogic.getAllIDs();
        response.status(200).send(getIDs);
    }
    catch (err) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.message);
    }
})


module.exports = router;