const { request, response } = require('express');

const userGet = (req = request, res = response) => {
    // http://localhost:8082/api/users?q=10
    const { q } = req.query;
    res.json({
        msg: 'get API',
        q
    });
};

const userPut = ('/', (req = request, res = response) => {
    const id = req.params.id;
    res.json({
        msg: 'put API',
        id
    });
})
const userPost = ('/', (req = request, res = response) => {
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - userPost',
        nombre, edad
    });
})
const userDelete = ('/', (req = request, res = response) => {
    res.json({
        msg: 'delete API'
    });
})

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}