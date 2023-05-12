const express = require('express')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const AppError = require('./utils/appError')
const app = express()
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const globalErrorHandler = require('./controllers/errController');


// GLOBAL MIDDLEWARE //
// Set Security HTTP headers
app.use(helmet())
// Limit requests from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter);
// Body parser, rading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against
app.use(xss());
// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'Difficulty']
}))

    // if we are in the development:
if(process.env.NODE_ENV === 'developmsent') {
    console.log('We are in development 🔰')
}

// ROUTES //
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)


module.exports = app