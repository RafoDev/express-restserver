const { response } = require("express");
const bcryptjs = require('bcryptjs');

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");
const { User } = require("../models");

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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { email, name, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        if (!user) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
                role: 'USER_ROLE'
            }
            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado'
            });
        }
        // generar jwt
        const token = await generateJWT(user.id);

        return res.json({
            msg: 'todo OK',
            token,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}