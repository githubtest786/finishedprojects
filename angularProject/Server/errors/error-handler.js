let errorHandler = (e, request, response, next) => {
    if (e.errorType.isShowStackTrace) {
        console.error(e);
    }

    response.status(e.errorType.httpCode).json({error: e.errorType.message});
}

module.exports = errorHandler;