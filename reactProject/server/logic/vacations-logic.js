let vacationsDao = require("../dao/vacations-dao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");
const cache = require("../cache/usersCache");
const uuid = require("uuid");
const fs = require("fs");

async function getAllVacations () {  // Gets all vacations.
    let getAllVacations = await vacationsDao.getAllVacations();
    return getAllVacations;
}

async function getAllVacationsDescriptions () {  // Gets all vacations descriptions.

    let getAllVacationsDescriptions = await vacationsDao.getAllVacationsDescriptions();
    return getAllVacationsDescriptions;
}

async function updateVacation (token, vacation, file) { // Updates a vacation, only if the user sending the request is an admin.

    if (!fs.existsSync("../uploads")) {
        fs.mkdirSync("../uploads");
    }

    let userCache = await cache.getData(token);

    let role = userCache.role;

    try {
        if (role != "admin") {
            throw new ServerError({httpCode: ErrorType.NOT_ADMIN.httpCode, message: ErrorType.NOT_ADMIN.message});
        }

        let newImageFullName;

        if (file != null) {
            const extension = file.name.substr(file.name.lastIndexOf("."));

            let newUuidFileName = uuid.v4();
        
            file.mv("./uploads/" + newUuidFileName + extension);
        
            newImageFullName = newUuidFileName+extension;
    
        }

        let findOriginalImage = await vacationsDao.findOriginalVacationImage(vacation.vacation_id);

        let originalImage = (findOriginalImage[0].image).slice(22);

        let updateVacation = await vacationsDao.updateVacation(vacation, newImageFullName);

        if (file != null) {
            await deleteFile("./uploads/" + originalImage);
        }

        let allVacations = await vacationsDao.getAllVacations();

        return allVacations;

        // return updateVacation;
    }

    catch (error) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        
    }
}

async function deleteVacation (vacation, token) {// Deletes a vacation, only if the user sending the request is an admin.

    let userCache = await cache.getData(token);

    let role = userCache.role;

    if (role != "admin") {
        throw new ServerError({httpCode: ErrorType.NOT_ADMIN.httpCode, message: ErrorType.NOT_ADMIN.message});
    }

    let deleteVacation = await vacationsDao.deleteVacation(vacation);

    let allVacations = await vacationsDao.getAllVacations();

    return allVacations;

    // return deleteVacation;
}

async function followVacation (token, vacation) { // Follows a vacation.

    let userCache = await cache.getData(token);

    let findVacationID = await vacationsDao.findVacation(vacation);

    let followVacation = await vacationsDao.followVacation(userCache, findVacationID);

    return followVacation;

}

async function unfollowVacation (token, vacation) { // Unfollows a vacation.

    let userCache = await cache.getData(token);
    
    let findVacationID = await vacationsDao.findVacation(vacation);

    let unfollowVacation = await vacationsDao.unfollowVacation(userCache, findVacationID);

    return unfollowVacation;

}

async function allVacationsFollows (token) { // All vacations follows of the user

    let userCache = await cache.getData(token);

    let allVacationsFollows = await vacationsDao.allVacationsFollows(userCache);

    return allVacationsFollows;
}

async function addVacation (token, vacation, file) { // Saves the name of an image in the right location in the DB.

    if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
    }

    let userCache = await cache.getData(token);

    let role = userCache.role;

    try {

        if (role != "admin") {
            throw new ServerError({httpCode: ErrorType.NOT_ADMIN.httpCode, message: ErrorType.NOT_ADMIN.message});
        }

        const extension = file.name.substr(file.name.lastIndexOf("."));

        let newUuidFileName = uuid.v4();
    
        file.mv("./uploads/" + newUuidFileName + extension);
    
        let newImageFullName = newUuidFileName+extension;

        let addVacation = await vacationsDao.addVacation(vacation, newImageFullName);

        let allVacations = await vacationsDao.getAllVacations();

        return allVacations;

        // return [addVacation, newImageFullName];

    }

    catch (error) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

}

async function deleteFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    getAllVacations,
    getAllVacationsDescriptions,
    addVacation,
    updateVacation,
    deleteVacation,
    followVacation,
    unfollowVacation,
    allVacationsFollows,
}