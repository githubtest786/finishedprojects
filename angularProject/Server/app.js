const express = require("express");
const usersController = require("./controllers/users-controller");
const productsController = require("./controllers/products-controller");
const cartsController = require("./controllers/carts-controller");
const ordersController = require("./controllers/orders-controller");
const categoriesController = require("./controllers/categories-controller");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const server = express();

server.use(express.static('uploads'));
server.use(fileUpload());

const loginFilter = require("./middleware/login-filter");

server.use(express.json());
server.use(bodyParser.urlencoded( { extended: false}));
server.use(bodyParser.json());
server.use(loginFilter());

server.use((req, res, next) => {
    res.header("Access-Contorl-Allow-Origin", "http:localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
    }
    next();
});

server.use("/api/users", usersController);
server.use("/api/products", productsController);
server.use("/api/carts", cartsController);
server.use("/api/orders", ordersController);
server.use("/api/categories", categoriesController);

server.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
})