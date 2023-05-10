const express = require('express')
const AppError = require('./utils/appError')
const app = express()
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
const globalErrorHandler = require('./controllers/errController');


// MIDDLEWARE //
app.use(express.json()) 

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