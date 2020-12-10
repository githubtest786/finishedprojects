const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllProducts () { // Gets all the products in the DB.

    let allProducts = "SELECT products.product_name, categories.category_name, products.price, products.image FROM products INNER JOIN categories ON products.category_id=categories.category_id where product_name is not null ORDER BY products.product_id";
    let productsResponse = await connection.execute(allProducts);

    return (productsResponse);

}


async function getProductByName (product) { // Gets a specific product by searching with a specific given name.

    let product_name = product;

    let getProductSql = "SELECT * FROM products WHERE product_name = ?";
    let getProductResponse = await connection.executeWithParameters(getProductSql, [product_name]);

    if (getProductResponse.length == 0) {
        throw new ServerError ({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

    return (getProductResponse[0]);

}


async function addProduct (product, category_id, product_image) { // Adds a new product to the DB.

    let product_name = product.product_name;
    let category = category_id;
    let price = product.price;
    let image = product_image;

    let addProductSql = "INSERT INTO products (product_name, category_id, price, image) VALUES (?, ?, ?, ?)";
    let addProductResponse = await connection.executeWithParameters(addProductSql, [product_name, category, price, image]);

    return(addProductResponse);

}


async function findProductIDAndImage (product_name) { // Finds the product ID.

    let product = product_name;

    let searchIDSql = "SELECT product_id, image FROM products WHERE product_name = ?";
    let response = await connection.executeWithParameters(searchIDSql, [product]);

    return(response[0]);
}


async function editProduct (product, id, category_id, newImageName) { // Edits an already existing product.

    let product_id = id;
    let product_name = product.product_name;
    let category = category_id;
    let price = product.price;
    let newImage = newImageName;

    let updateProductSql;
    let UpdateProductResponse;

    if (newImage != null) {
        updateProductSql = "UPDATE products SET product_name = ?, category_id = ?, price = ?, image = ? WHERE product_id = ?";
        updateProductResponse = await connection.executeWithParameters(updateProductSql, [product_name, category, price, newImage, product_id]);
    }
    else {
        updateProductSql = "UPDATE products SET product_name = ?, category_id = ?, price = ? WHERE product_id = ?";
        updateProductResponse = await connection.executeWithParameters(updateProductSql, [product_name, category, price, product_id]);
    }

    if (updateProductResponse.length == 0) {
        throw new ServerError ({httpCode: ErrorType.PRODUCT_NOT_FOUND.httpCode, message: ErrorType.PRODUCT_NOT_FOUND.message});
    }

    return (updateProductResponse[0]); 

}

async function getAmountOfProducts () { // Gets amount of different products available.

    let amountOfProductsSql = "SELECT product_id FROM products";
    let response = await connection.execute(amountOfProductsSql);

    return(response);
}

module.exports = {
    getAllProducts,
    getProductByName,
    addProduct,
    findProductIDAndImage,
    editProduct,
    getAmountOfProducts
}