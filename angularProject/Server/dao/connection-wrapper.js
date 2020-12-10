const mysql = require('mysql');

// Connecting to mysql. Before choosing a database, I decided to make everything automatic, so I wouldn't have to use mySql's workbench.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234'
})

// Creating a new DB in the mySql account.

function createDB (DB_name) {
    connection.query("CREATE DATABASE IF NOT EXISTS ??", DB_name, function (err, result) {
        if (err) {
            console.log("Malfunction");
            throw err;
        }
    });
}

// Picks the newly established DB as a part of the mySql connection that was previously formed.

function pickDB(DB_name) {
    connection.changeUser({database: DB_name}, function(err) {
        if (err) {
            throw err;
        }
        console.log("Mysql connection connected to " + DB_name + " database!");
    })
}

// Hard-coded DB name.
let DB = "market";

// Creates the DB.
createDB(DB);

pickDB(DB);

function execute(sql) {
    return new Promise ((resolve, reject) => {
        connection.query (sql, (err, result) => {
            if (err) {
                console.log("Error " + err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

function executeWithParameters(sql, parameters) {
    return new Promise ((resolve, reject) => {
        connection.query (sql, parameters, (err, result) => {
            if (err) {
                console.log("Error " + err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    execute,
    executeWithParameters
}