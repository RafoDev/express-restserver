const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const userGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;

    const [total, users] = await Promise.all([
        User.countDocuments({ status: true }),
        User.find({ status: true })
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        msg: 'get API',
        total,
        users
    });
};

const userPut = ('/', async (req = request, res = response) => {
    const { id } = req.params;


    const { password, google, email, _id, ...rest } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);
    res.json({ user });
})
const userPost = ('/', async (req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });

    // check if email exists


    // password encrypted
    const salt = bcryptjs.genSaltSync();
    newUser.password = bcryptjs.hashSync(password, salt);

    await newUser.save();


    res.json({
        msg: 'post API - userPost',
        newUser
    });
})
const userDelete = ('/', async (req = request, res = response) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {status : false});

    res.json({
        msg: 'delete API',
        user
    });
})

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}