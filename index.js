const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrls = require('./routes/routes')
const cors = require('cors')

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS, 
    { useNewUrlParser: true },
    () =>console.log("Database connected"))

app.use(express.json())
app.use(cors())
app.use('/CCSUWellness', routesUrls)
app.listen(19009, () => console.log("server is up and running"))