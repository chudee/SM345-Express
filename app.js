/* ====================================
        LOAD THE DEPENDENCIES
===================================== */ 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const https = require('https')
const fs = require('fs')

/* ====================================
        LOAD THE CONFIG
===================================== */ 
const { secret, database } = require('./config')
const port = process.env.port || 8080
const options = {
    cert: fs.readFileSync(__dirname + '/sslcert/fullchain.pem'),
    key: fs.readFileSync(__dirname + '/sslcert/privkey.pem'),
};

/* ====================================
        EXPRESS CONFIGURATION
===================================== */ 
const app = express()

//app.use(express.static(__dirname + '/static'))
app.use(express.static(__dirname + '/dist'))
app.use(require('helmet')())

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

// health-check
app.get ('/health-check', (req, res) => res.sendStatus (200));

// open the server
app.listen(port, () => {
    console.log(`Express is running on port ${port}`)
})

// https
https.createServer(options, app).listen(443)
