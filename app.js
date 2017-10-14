/* ====================================
        LOAD THE DEPENDENCIES
===================================== */ 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

/* ====================================
        LOAD THE CONFIG
===================================== */ 
const { secret, database } = require('./config')
const port = process.env.port || 3000

/* ====================================
        EXPRESS CONFIGURATION
===================================== */ 
const app = express()

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', secret)

// set the mysql connection
app.set('database', database)

// Cross Origin use
app.use(cors())

// index page, just for testing
app.get('/', (req, res) => {
    res.send('Hello JWT Server')
})

// configure api router
app.use('/api', require('./routes/api'))

// open the server
app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
})
