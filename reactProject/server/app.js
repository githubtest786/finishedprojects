const express = require("express");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const errorHandler = require("./errors/error-handler");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const server = express();

const cors = require("cors");

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}

server.use(cors(corsOptions));

const socket = require("./utils/socket");

server.use(express.static('uploads'));
server.use(fileUpload());

const loginFilter = require("./middleware/login-filter");

server.use(express.json());
server.use(bodyParser.urlencoded( { extended: false}));
server.use(bodyParser.json());
server.use(loginFilter());

server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);
server.use(errorHandler);

server.listen(3001, () => console.log("Listening on http://localhost:3001"));