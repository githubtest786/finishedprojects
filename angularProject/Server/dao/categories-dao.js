const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllCategories () { // Gets all categories.

    const allCategoriesSql = "SELECT category_name FROM categories ORDER BY category_id";
    const response = connection.execute(allCategoriesSql);

    return response;
}

async function findCategoryID(category_name) { // Translates a category name given to the id of it, in order to add new products into it.

    let category = category_name;

    let findCategoryID = "SELECT category_id FROM categories WHERE category_name = ?";
    let response = await connection.executeWithParameters(findCategoryID, [category]);

    if (response.length == 0) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    return(response[0].category_id);
}

module.exports = {
    getAllCategories,
    findCategoryID
}