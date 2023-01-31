const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generateJWT");
const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // emailExist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }
        // userIsActive
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario no esta activo'
            });
        }
        // verifyPassword
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // JWT
        const token = await generateJWT(user.id);

        return res.json({
            msg: 'Login OK',
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login
}