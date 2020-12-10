const connection = require("./connection-wrapper");

// This file essentially allows to create the entire required database from scratch assuming it doesn't already exist.

async function createUsersTable () {
    let sql = "CREATE TABLE IF NOT EXISTS users (user_id BIGINT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45), username VARCHAR(45) UNIQUE, password VARCHAR(45), role VARCHAR(45) DEFAULT 'customer')";
    await connection.execute(sql);
}

async function createVacationsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS vacations (vacation_id BIGINT AUTO_INCREMENT PRIMARY KEY, description VARCHAR(45) UNIQUE, destination VARCHAR(45), image VARCHAR(100), dates VARCHAR(45), price INT, followers BIGINT DEFAULT 0)";
    await connection.execute(sql);
}

async function createUserVacationsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS user_vacations (user_vacation_id BIGINT AUTO_INCREMENT PRIMARY KEY, vacation_id BIGINT, FOREIGN KEY (vacation_id) REFERENCES vacations (vacation_id), user_id BIGINT, FOREIGN KEY (user_id) REFERENCES users (user_id))";
    await connection.execute(sql);
}

createUsersTable();
createVacationsTable();
createUserVacationsTable();