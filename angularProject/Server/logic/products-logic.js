const dao = require("../dao/products-dao");
const categoryDAO = require("../dao/categories-dao");
const ErrorType = require("./../errors/error-type");
const cache = require("../cache/usersCache");
const uuid = require("uuid");
const fs = require("fs");
let ServerError = require("../errors/server-error");

async function getAllProducts () {  // Gets all products.
    let getAllProducts = await dao.getAllProducts();
    return getAllProducts;
}

async function addProduct (token, product, file) { // Adds a product, only if the user sending the request is an admin.

    let userCache = await cache.getData(token);

    let role = userCache.role;

    try {
    
        if (role != "admin") {
            throw new ServerError ({httpCode: ErrorType.NOT_ADMIN.httpCode, message: ErrorType.NOT_ADMIN.message});
        }
    
        const extension = file.name.substr(file.name.lastIndexOf("."));
    
        let newUuidFileName = uuid.v4();
    
        file.mv("./uploads/" + newUuidFileName + extension);
    
        let newImageFullName = newUuidFileName+extension;
        
        let category_name = product.category_name;

        let findProductCategoryID = await categoryDAO.findCategoryID(category_name);

        if (findProductCategoryID < 1 || findProductCategoryID == null) {
            throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
        }

        let addProduct = await dao.addProduct(product, findProductCategoryID, newImageFullName);

        return addProduct;

    }
    catch (error) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

}

async function editProduct (token, product, file) { // Updates the values of an existing product, only if the user sending the request is an admin.

    let userCache = await cache.getData(token);
    let role = userCache.role;

    try {

        if (role != "admin") {
            throw new ServerError ({httpCode: ErrorType.NOT_ADMIN.httpCode, message: ErrorType.NOT_ADMIN.message});
        }

        let newImageFullName;

        if (file != null) { // Checks if the admin wants to replace the image of the product they were editing
            const extension = file.name.substr(file.name.lastIndexOf("."));
    
            let newUuidFileName = uuid.v4();
        
            file.mv("./uploads/" + newUuidFileName + extension);
        
            newImageFullName = newUuidFileName+extension;
        }

        let originalProductName = product.original_name;

        let findProductIDAndImage = await dao.findProductIDAndImage(originalProductName);

        let originalImage = findProductIDAndImage.image;
        let productID = findProductIDAndImage.product_id;

        let category_name = product.category_name;
    
        findProductCategoryID = await categoryDAO.findCategoryID(category_name);
    
        let editProduct = await dao.editProduct(product, productID, findProductCategoryID, newImageFullName);

        if (file != null) {
            await deleteFile("./uploads/" + originalImage);
        }

        return editProduct;

    }

    catch (error) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }
}

async function getAmountOfProducts () { // Gets the amount of different products available.

    let response = await dao.getAmountOfProducts();
    
    if (response == []){
        return 0;
    }

    return(response.length);
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
    getAllProducts,
    addProduct,
    editProduct,
    getAmountOfProducts
}