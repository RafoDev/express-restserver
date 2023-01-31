const jwt = require("jsonwebtoken")

const generateJWT = (uid) => {
    return new Promise((res, rej) => {
        const payload = { uid };
        const secretKey = process.env.SECRET_KEY;
        jwt.sign(payload, secretKey, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                rej('No se pudo generar el token');
            } else {
                res(token);
            }
        });
    })
}

module.exports = {
    generateJWT
}