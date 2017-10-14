const jwt = require('jsonwebtoken')
const { query } = require('../../../models/login')
const async = require('async')
const mysql = require('mysql')

/*
    POST /api/auth/login
    {
        id,
        password
    }
*/

exports.login = async (req, res) => {
    const { id, password } = req.body
    const secret = req.app.get('jwt-secret')
    const database = req.app.get('database')

    const createDB = (cb) => {
        const conn = mysql.createConnection(database)
        if(conn) {
            cb(null, conn)
        } else {
            cb(err, null)
        }
    }

    const queryDB = (conn, cb) => {
        conn.query(query, [id, password], function(err, rows, fields) {
            console.log(rows)
            if (err) {
                cb(err, null)
            } else {
                cb(null, rows)
                conn.end()
            }
        })   
    }

    const createToken = (rows, cb) => {
        jwt.sign(
            {
                _id: rows.id,
                username: rows[0].user_id
            }, 
            secret, 
            {
                expiresIn: '7d',
                issuer: 'sm345.com',
                subject: 'userInfo'
            }, (err, token) => {
                if(err) {
                    cb(err, null)
                } else {
                    cb(null, token)
                }
            }
        )
    }

    async.waterfall([createDB, queryDB, createToken], function (err, token) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: err
            }));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'logged in successfully',
                token
            }));
        }
    });
}

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}