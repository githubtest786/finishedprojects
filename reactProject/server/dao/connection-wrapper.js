let ServerError = require("./../errors/server-error");
let ErrorType = require("./../errors/error-type");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
});

function createDB (DB_name) { // Creating a new DB in the mySql account.
    connection.query("CREATE DATABASE IF NOT EXISTS ??", DB_name, function (err, result) {
        if (err) {
            console.log("Malfunction");
            throw err;
        }
    });
}


function pickDB(DB_name) { // Picks the newly established DB as a part of the mySql connection that was previously formed.
    connection.changeUser({database: DB_name}, function(err) {
        if (err) {
            throw err;
        }
        console.log("Mysql connection connected to " + DB_name + " database!");
    })
}

// A process that pretty much lets the user avoid dealing with MySQL's workbench, as everything is being managed as the server is being ran for the very first time.
let DB_name = "vacations_management";
createDB(DB_name);
pickDB(DB_name);


connection.connect(err => {
    if (err) {
        console.log("Failed to create connection + " + err);
        return;
    }
    console.log("We're connected to MySQL");
});

function execute(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
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
};