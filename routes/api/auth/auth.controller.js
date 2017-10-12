const jwt = require('jsonwebtoken')
const { query } = require('../../../models/login');

/*
    POST /api/auth/login
    {
        id,
        password
    }
*/
exports.login = (req, res) => {
    const { id, password } = req.body
    const secret = req.app.get('jwt-secret')
    const connection = req.app.get('connection')

    connection.query(query, [id, password], function(err, user, fields) {
        if (!err) {
            check(user[0])
            .then(respond)
            .catch(onError)
        }
    })

    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(user.user_password === password) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user.id,
                            username: user.user_id
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'sm345.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }
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