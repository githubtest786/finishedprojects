let vacationsLogic = require("../logic/vacations-logic");
const express = require("express");
const cache = require("../cache/usersCache");
const ErrorType = require("./../errors/error-type");

const router = express.Router();
const fs = require("fs");
const uuid = require("uuid");

const socket = require("../utils/socket");

let currentVacations;

socket.on('connection', (socket) => {

    socket.on('addvacation', (data) => {
        console.log(data);
        setTimeout(function(){
            socket.broadcast.emit('changedvacations',  currentVacations);
        }, 1000);
    })

    socket.on('deletevacation', (data) => {
        console.log(data);
        setTimeout(function(){
            socket.broadcast.emit('changedvacations',  currentVacations);
        }, 1000);
    })
    
    socket.on('editvacation', (data) => {
        console.log(data);
        setTimeout(function(){
            socket.broadcast.emit('changedvacations',  currentVacations);
        }, 1000);
    })
});


router.get("/getallvacations", async (request, response) => { // Gets all vacations.

    console.log("All vacations!");

    try {
        let allVacations = await vacationsLogic.getAllVacations();
        response.status(200).send(allVacations);
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.GENERAL_ERROR.message);
    }
});

router.get("/getallvacationsdescriptions", async (request, response) => { // Gets all vacations descriptions

    console.log("All vacations descriptions!");

    try {
        let allVacationsDescriptions = await vacationsLogic.getAllVacationsDescriptions();
        response.status(200).send(allVacationsDescriptions);
    }
    catch (error) {
        response.status(ErrorType.GENERAL_ERROR.httpCode).send(ErrorType.GENERAL_ERROR.GENERAL_ERROR.message);
    }

});

router.post("/followvacation", async (request, response) => { // Occurs when a user follows a vacation.

    console.log("Follow a vacation!");

    let authorizationString = request.headers["authorization"];
    let token = authorizationString.substring("Bearer ".length);

    let vacation = request.body;

    try {
        let followVacation = await vacationsLogic.followVacation(token, vacation);
        response.status(200).send({follow_approval : "Followed successfully"});
    }
    catch (error) {
        response.status(ErrorType.VACATION_NOT_FOUND.httpCode).send(ErrorType.VACATION_NOT_FOUND.message);
    }

})

router.post("/unfollowvacation", async (request, response) => { // Occurs when a user unfollows a vacation.

    console.log("Unfollow a vacation!");

    let authorizationString = request.headers["authorization"];
    let token = authorizationString.substring("Bearer ".length);

    let vacation = request.body;

    try {
        let unfollowVacation = await vacationsLogic.unfollowVacation(token, vacation);
        response.status(200).send({unfollow_approval : "Unfollowed successfully"});
    }
    catch (error) {
        response.status(ErrorType.VACATION_NOT_FOUND.httpCode).send(ErrorType.VACATION_NOT_FOUND.message);
    }

})

router.get("/getallvacationsfollows", async (request, response) => { // Gets all vacations follows of the user

    console.log("All vacations follows");

    let authorizationString = request.headers["authorization"];
    let token = authorizationString.substring("Bearer ".length);

    try {
        let allVacationsFollows = await vacationsLogic.allVacationsFollows(token);
        response.status(200).send(allVacationsFollows);
    }
    catch (error) {
        response.status(ErrorType.UNAUTHORIZED.httpCode).send(ErrorType.UNAUTHORIZED.message);
    }

})

router.patch("/updatevacation", async (request, response) => { // Updates a vacation.
    console.log("/Update vacation");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    let vacation = request.body;

    try {

        let file;

        if (request.files != null) {
            file = request.files.image;
        }

        const updateVacation = await vacationsLogic.updateVacation(token, vacation, file);

        currentVacations = updateVacation;

        response.status(201).send({vacation_approval : "Updated vacation successfully!"});
        }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.delete("/deletevacation/:vacation", async (request, response) => { // Deletes a vacation.
    console.log("/Delete vacation");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    let vacation = request.params.vacation;

    try {
        const deleteVacationAndGetThemAll = await vacationsLogic.deleteVacation(vacation, token);

        currentVacations = deleteVacationAndGetThemAll;

        response.status(201).send({vacation_approval : "Deleted vacation successfully!"});
        }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
})

router.post("/addnewvacation", async (request, response) => { // Uploads the image of a vacation to the server.
    console.log("/Add vacation");

    let autorizationString = request.headers["authorization"];
    let token = autorizationString.substring("Bearer ".length);

    let vacation = request.body;
    let file = request.files.image;

    try {

        const addVacationAndGetThemAll = await vacationsLogic.addVacation(token, vacation, file);

        currentVacations = addVacationAndGetThemAll;

        response.status(201).send({vacation_approval : "Added vacation successfully!"});
    }
    catch (err) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
})


module.exports = router;