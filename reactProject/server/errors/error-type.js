let ErrorType = {

    GENERAL_ERROR : { id: 1, httpCode: 600, message : "Something went wrong", isShowStackTrace: true},
    SERVER_RESET : { id: 2, httpCode: 601, message : "The server was reset. You are required to login once again.", isShowStackTrace: false},
    INCORRECT_INPUT : { id: 3, httpCode: 602, message : "Some of the details you have written are incorrect and do not fit our requirements. Please try again with different details.", isShowStackTrace: false},
    UNAUTHORIZED : { id: 4, httpCode: 401, message : "Login failed, invalid username or password", isShowStackTrace: false},
    VACATION_NOT_FOUND : { id: 5, httpCode: 603, message : "The vacation you were looking for was not found", isShowStackTrace: false},
    NOT_ADMIN : { id: 6, httpCode: 604, message : "A non-admin user attempted to use an admin-only function", isShowStackTrace: false}

}

module.exports = ErrorType;