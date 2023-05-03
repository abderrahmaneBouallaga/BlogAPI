const express = require('express')

const app = express()
const postRouter = require('./routes/postRoutes')


// MIDDLEWARE //
app.use(express.json()) 

    // if we are in the development:
if(process.env.NODE_ENV === 'developmsent') {
    console.log('We are in development 🔰')
}

// ROUTES //
app.use('/api/v1/posts', postRouter)



module.exports = app