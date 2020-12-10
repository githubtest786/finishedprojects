let ErrorType = {

    GENERAL_ERROR : { id: 1, httpCode: 500, message : "Something went wrong", isShowStackTrace: true},
    SERVER_RESET : { id: 2, httpCode: 401, message : "The server was reset. The user is unauthorized as their data is no longer in the user cache and thus are required to login once again.", isShowStackTrace: false},
    INCORRECT_INPUT : { id: 3, httpCode: 602, message : "Some of the details you have written are incorrect and do not fit our requirements. Please try again with different details.", isShowStackTrace: false},
    UNAUTHORIZED : { id: 4, httpCode: 401, message : "Login failed, invalid username or password", isShowStackTrace: false},
    VACATION_NOT_FOUND : { id: 5, httpCode: 603, message : "The vacation you were looking for was not found", isShowStackTrace: false},
    NOT_ADMIN : { id: 6, httpCode: 604, message : "A non-admdin user attempted to use an admin-only function", isShowStackTrace: false},
    PRODUCT_NOT_FOUND : { id: 7, httpCode: 605, message: "Wanted product is not found", isShowStackTrace: false},
    CART_NOT_FOUND : { id: 8, httpCode: 606, message: "The cart you were looking for is not found", isShowStackTrace: false},
    PRICE_MISMATCH : { id: 9, httpCode: 607, message: "The price of the item trying to be added doesn't match the one in the DB", isShowStackTrace: false},
    CART_ALREADY_EXISTS : { id: 10, httpCode: 608, message: "Cart already exists, no reason to attempt to create a new one", isShowStackTrace: false},

}

module.exports = ErrorType;