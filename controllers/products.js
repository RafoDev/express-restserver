const { request, response } = require('express');
const { Product, Category } = require('../models');

const createProduct = async (req = request, res = response) => {
    const { name, price = 0, category, desc = '', aviable = true } = req.body;
    const user = req.user._id;

    const productExists = await Product.findOne({ name });

    if (productExists) {
        return res.status(400).json({
            msg: `El producto ${name} ya existe`
        });
    }

    const data = {
        name,
        status: true,
        user,
        price,
        category,
        desc,
        aviable
    }

    const newProduct = new Product(data);
    await newProduct.save();

    return res.status(201).json(
        newProduct
    )
}

// obtenerCategorias - paginado - total - populate(para indicar todo el usuario)
const getProducts = async (req, res = response) => {
    const { from = 0, limit = 5 } = req.query;

    const [total, products] = await Promise.all([
        Product.countDocuments({ status: true }),
        Product.find({ status: true })
            .populate('category', 'name')
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        products
    })

}

// ObtenerCategoria - populate {}
const getProductById = async (req, res = response) => {
    const { id } = req.params;
    const product = await Product
        .findById(id)
        .populate('category', 'name')
        .populate('user', 'name');

    if (!product.status) {
        res.status(404).json({
            msg: 'El producto se encuentra desactivado'
        });
    }

    res.status(200).json({
        msg: 'OK',
        product
    })
}
// Actualizar producto
const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { name, price, category, desc, aviable } = req.body;

    const productExists = await Product.findOne({ name });

    if (productExists) {
        return res.status(401).json({
            msg: `Ya existe un producto con el nombre ${name}`
        });
    }

    const newData = {
        name,
        user: req.user._id,
        price,
        category,
        desc,
        aviable,
    }

    const product = await Product.findByIdAndUpdate(id, newData, { new: true });

    res.json(product);
}

// Borrar Categoria
const deleteProduct = async (req, res = response) => {
    const { id } = req.params;
    const Product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json({
        msg: 'OK',
        Product
    })
}

module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    getProducts,
    deleteProduct
}