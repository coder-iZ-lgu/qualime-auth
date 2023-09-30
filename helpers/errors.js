class ApiError {
    constructor() {}

    static badRequest(res, message) {
        const statusCode = 400
        res.status(statusCode)

        return res.json({statusCode, message})
    }

    static Unauthorized(res, message) {
        const statusCode = 401
        res.status(statusCode)

         return res.json({statusCode, message})
    }

    static forbidden(res, message) {
        const statusCode = 403
        res.status(statusCode)

        return res.json({statusCode, message})
    }

    static notFound(res, message) {
        const statusCode = 404
        res.status(statusCode)

        return res.json({statusCode, message})
    }

    static internalServerError(res, message){
        const statusCode = 500
        res.status(statusCode)

        return res.json({statusCode, message})
    }
}

module.exports = ApiError;
