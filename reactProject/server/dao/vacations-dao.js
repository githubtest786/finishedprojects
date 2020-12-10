let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

async function getAllVacations () { // Gets all the vacations in the DB.

    let allVacations = "SELECT * FROM vacations";
    let vacationsResponse = await connection.execute(allVacations);

    return (vacationsResponse);
}

async function getAllVacationsDescriptions () { // Gets all the vacations' descriptions in the DB.

    let allVacationsDescriptions = "SELECT description FROM vacations";
    let allVacationsDescriptionsResponse = await connection.execute(allVacationsDescriptions);

    return (allVacationsDescriptionsResponse);
}

async function findVacation (vacation) { // Finds vacation id


    let vacation_description = vacation.vacation_description;

    let findVacation = "SELECT vacation_id FROM vacations WHERE description = ?";
    let findVactionSql = await connection.executeWithParameters(findVacation, [vacation_description]);

    return (findVactionSql[0]);
}

async function addVacation (vacation, image) { // Adds a new vacation to the DB.

    let description = vacation.description;
    let destination = vacation.destination;
    let dates = vacation.dates;
    let price = vacation.price;
    let path = "http://localhost:3001/";
    let img = path + image;


    let addVacationSql = "INSERT INTO vacations (description, destination, image, dates, price) VALUES (?, ?, ?, ?, ?)";
    let addVacationResponse = await connection.executeWithParameters(addVacationSql, [description, destination, img, dates, price]);

    return(addVacationResponse);
}

async function updateVacation (vacation, newImage) { // Updates a chosen vacation in the DB.

    let vacation_id = vacation.vacation_id;
    let description = vacation.description;
    let destination = vacation.destination;
    let dates = vacation.dates;
    let price = vacation.price;

    let updateVacationSql;
    let updateVacationResponse;

    if (newImage != null) {
        let path = "http://localhost:3001/";
        let img = path + newImage;
        updateVacationSql = "UPDATE vacations SET description = ?, destination = ?, image = ?, dates = ?, price = ? WHERE vacation_id = ?";
        updateVacationResponse = await connection.executeWithParameters(updateVacationSql, [description, destination, img, dates, price, vacation_id]);
    }
    else {
        updateVacationSql = "UPDATE vacations SET description = ?, destination = ?, dates = ?, price = ? WHERE vacation_id = ?";
        updateVacationResponse = await connection.executeWithParameters(updateVacationSql, [description, destination, dates, price, vacation_id]);
    }

    if (updateVacationResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.VACATION_NOT_FOUND.httpCode, message: ErrorType.VACATION_NOT_FOUND.message});
    }

    return(updateVacationResponse);
}

async function deleteVacation (vacation) { // Deletes a chosen vacation.

    let vacation_id = vacation;
    
    let deleteFollowersSql = "DELETE FROM user_vacations WHERE vacation_id = ?";
    let deleteFollowerResponse = await connection.executeWithParameters(deleteFollowersSql, [vacation_id]);

    let deleteVacationSql = "DELETE FROM vacations WHERE vacation_id = ?";
    let deleteVacationResponse = await connection.executeWithParameters(deleteVacationSql, [vacation_id]);

    return (deleteVacationResponse);
}

async function followVacation (user, vacation) { // Follow vacation

    let user_id = user.user_id;
    let vacation_id = vacation.vacation_id;
    
    let followVacationSql = "INSERT INTO user_vacations (vacation_id, user_id) VALUES (?, ?)";
    let followVacationResponse = await connection.executeWithParameters(followVacationSql, [vacation_id, user_id]);

    let getFollowers = "SELECT followers FROM vacations WHERE vacation_id = ?";
    let getFollowersResponse = await connection.executeWithParameters(getFollowers, [vacation_id]);


    let updatedFollowers = getFollowersResponse[0].followers + 1;

    let updateFollowers = "UPDATE vacations SET followers = ? WHERE vacation_id = ?";
    let updateFollowersResponse = await connection.executeWithParameters(updateFollowers, [updatedFollowers, vacation_id]);

    return updateFollowersResponse;
}

async function unfollowVacation (user, vacation) { // Unfollow vacation

    let user_id = user.user_id;
    let vacation_id = vacation.vacation_id;
    
    let unfollowVacationSql = "DELETE FROM user_vacations WHERE vacation_id = ? AND user_id = ?";
    let unfollowVacationResponse = await connection.executeWithParameters(unfollowVacationSql, [vacation_id, user_id]);

    let getFollowers = "SELECT followers FROM vacations WHERE vacation_id = ?";
    let getFollowersResponse = await connection.executeWithParameters(getFollowers, [vacation_id]);

    let updatedFollowers = getFollowersResponse[0].followers - 1;

    let updateFollowers = "UPDATE vacations SET followers = ? WHERE vacation_id = ?";
    let updateFollowersResponse = await connection.executeWithParameters(updateFollowers, [updatedFollowers, vacation_id]);

    return updateFollowersResponse;
}

async function allVacationsFollows (user) { // All vacations follows of the user

    let user_id = user.user_id;

    let allVacationsFollows = "SELECT user_vacations.vacation_id, vacations.description FROM user_vacations RIGHT JOIN vacations ON user_vacations.vacation_id = vacations.vacation_id WHERE user_id = ?";
    let allVacationsResponse = await connection.executeWithParameters(allVacationsFollows, [user_id]);

    return allVacationsResponse;
}

async function findOriginalVacationImage (vacation_id) {

    let id = vacation_id;

    let vacationID = "SELECT image FROM vacations WHERE vacation_id = ?";
    let vacationIDResponse = await connection.executeWithParameters(vacationID, [id]);

    return vacationIDResponse;
}

module.exports = {
    getAllVacations,
    getAllVacationsDescriptions,
    findVacation,
    addVacation,
    updateVacation,
    deleteVacation,
    followVacation,
    unfollowVacation,
    allVacationsFollows,
    findOriginalVacationImage
}