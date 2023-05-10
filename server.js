const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })
const app = require('./app')

// CONECTION TO DATA BASE //
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB Connection successful 🟢')
}).catch((err) => {
    console.log(err)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app running on port ${port} 🟢`)
})
