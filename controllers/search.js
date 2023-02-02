const { response } = require('express')
const { isValidObjectId } = require('mongoose');
const { User, Category, Product } = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
]


const searchUsers = async (term = '', res = response) => {
    const isMongoID = isValidObjectId(term);

    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regexp = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regexp }, { email: regexp }],
        $and: [{ status: true }]

    });
    return res.json({
        results: (users) ? [users] : []
    })

}

// buscar categorias
const searchCategories = async (term = '', res = response) => {

    const isMongoID = isValidObjectId(term);

    if (isMongoID) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regexp = new RegExp(term, 'i');
    const categories = await Category.find({ name: regexp });
    return res.json({
        results: (categories) ? [categories] : []
    })
}
// buscar productos
const searchProducts = async (term = '', res = response) => {

    const isMongoID = isValidObjectId(term);

    if (isMongoID) {
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regexp = new RegExp(term, 'i');
    const products = await Product.find({ name: regexp }).populate('category', 'name');
    return res.json({
        results: (products) ? [products] : []
    })
}

const search = async (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son ${allowedCollections}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }
}

module.exports = { search };