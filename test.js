const crypto = require('crypto');

const header = {
    "typ": "JWT",
    "alg": "HS256"
};

const encodedHeader = new Buffer(JSON.stringify(header))
    .toString('base64')
    .replace('=', '');

const payload = {
    "iss": "sm345.com",
    "exp": "1485270000000",
    "https://localhost:3000/jwt_claims/is_login": true,
    "userId": "11028373727102",
    "username": "test"
}

// encode to base64
const encodedPayload = new Buffer(JSON.stringify(payload))
    .toString('base64')
    .replace('=', '');

const signature = crypto.createHmac('sha256', 'secret')
    .update(encodedHeader + '.' + encodedPayload)
    .digest('base64')
    .replace('=', '');
               
console.log('payload: ',encodedPayload);
console.log('signature: ',signature);

console.log(`${encodedHeader}.${encodedPayload}.${signature}`)