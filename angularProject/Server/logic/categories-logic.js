const dao = require("../dao/categories-dao");

async function getAllCategories () { // Gets all categories.

    const getAllCategories = await dao.getAllCategories();
    return getAllCategories;
}

getAllCategories();

module.exports = {
    getAllCategories
}