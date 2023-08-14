class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4)?'fail':'error';
        this.isOperational = true;

        // to capture the stack trace without this constuctor
        Error.captureStackTrace(this,this.consturctor);
    }
}

module.exports = AppError;