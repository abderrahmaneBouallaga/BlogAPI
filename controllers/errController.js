const AppError = require('../utils/appError')


const handleJWTError = () => new AppError('Invalid token. PLease log in agian!', 401)
const handleJWTExpiredError = () => new AppError('Your token has expired Please log in again', 401)
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    
    const message = `Duplicate field value: ${value}. Please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400);
}

// Send error in the developement
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

// Send error in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else {
        // log err
        console.error('ERROR 💥', err)

        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    }else if(process.env.NODE_ENV === 'production') {

        if (err.name === 'CastError') err = handleCastErrorDB(err)
        if (err.code === 11000) err = handleDuplicateFieldsDB(err)
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err)
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTError();

        sendErrorProd(err, res)
    }
}
