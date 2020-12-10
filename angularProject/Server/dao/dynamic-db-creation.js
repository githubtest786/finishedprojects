const connection = require("./connection-wrapper");

// This file essentially allows to create the entire required database from scratch assuming it doesn't already exist.

async function createUsersTable () {
    let sql = "CREATE TABLE IF NOT EXISTS users (user_id BIGINT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45), username_email VARCHAR(45) UNIQUE, id_number INT, password VARCHAR(45), city VARCHAR(45), street VARCHAR(45), role VARCHAR(45) DEFAULT 'customer')";
    await connection.execute(sql);
}

async function createCategoriesTable () {
    let sql = "CREATE TABLE IF NOT EXISTS categories (category_id BIGINT AUTO_INCREMENT PRIMARY KEY, category_name VARCHAR(45) UNIQUE)";
    await connection.execute(sql);
}

async function createProductsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS products (product_id BIGINT AUTO_INCREMENT PRIMARY KEY, product_name VARCHAR(45) UNIQUE, category_id BIGINT, FOREIGN KEY (category_id) REFERENCES categories (category_id), price INT, image VARCHAR(45))";
    await connection.execute(sql);
}

async function createCartsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS carts (cart_id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, FOREIGN KEY (user_id) REFERENCES users (user_id), creation_date DATE)";
    await connection.execute(sql);
}

async function createCartItemsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS cart_items (cartitem_id BIGINT AUTO_INCREMENT PRIMARY KEY, product_id BIGINT, FOREIGN KEY (product_id) REFERENCES products (product_id), amount INT, price INT, cart_id BIGINT, FOREIGN KEY (cart_id) REFERENCES carts (cart_id))";
    await connection.execute(sql);
}

async function createOrdersTable () {
    let sql = "CREATE TABLE IF NOT EXISTS orders (order_id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, FOREIGN KEY (user_id) REFERENCES users (user_id), cart_id BIGINT, FOREIGN KEY (cart_id) REFERENCES carts (cart_id), final_price INT, city_for_shipping VARCHAR(45), street_for_shipping VARCHAR(45), shipping_date DATE, order_date DATE, 4_credit_card_letters INT)";
    await connection.execute(sql);
}


createUsersTable();
createCategoriesTable();
createProductsTable();
createCartsTable();
createCartItemsTable();
createOrdersTable();