const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la request'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(uid);
    
        // User exists
        if(!user){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            })
        }

        // uid is active
        if(!user.status){
            return res.status(401).json({
                msg: 'Token no válido - user inactive'
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no válido'
        })
    }
}

module.exports = {
    validateJWT
}