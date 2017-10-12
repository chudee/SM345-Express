/* ====================================
        LOAD THE DEPENDENCIES
===================================== */ 
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mysql = require('mysql')
// const crypto = require('crypto')

/* ====================================
        LOAD THE CONFIG
===================================== */ 
const { secret, database } = require('./config')
const connection = mysql.createConnection(database)
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
app.set('connection', connection)

// Add headers
app.use(function (req, res, next) {

        // Website you wish to allow to connect
        // 아직 로컬 테스트용으로 설정함.
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
});

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
