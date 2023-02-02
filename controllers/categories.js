const { request, response } = require('express');
const { Category } = require('../models');

const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        });
    }

    const data = {
        name,
        status: true,
        user: req.user._id
    }

    const newCategory = new Category(data);
    await newCategory.save();

    return res.status(201).json({
        msg: 'post'
    })
}

// obtenerCategorias - paginado - total - populate(para indicar todo el usuario)
const getCategories = async (req, res = response) => {
    const { from = 0, limit = 5 } = req.query;

    const [total, categories] = await Promise.all([
        Category.countDocuments({ status: true }),
        Category.find({ status: true })
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categories
    })

}

// ObtenerCategoria - populate {}
const getCategoryById = async (req, res = response) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate('user', 'name');

    if (!category.status) {
        res.status(404).json({
            msg: 'La categoría se encuentra desactivada'
        });
    }

    res.status(200).json({
        msg: 'OK',
        category
    })
}
// Actualizar categoria
const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        return res.status(401).json({
            msg: `Ya existe una categoría con el nombre ${name}`
        });
    }
    const newData = {
        name,
        user: req.user._id
    }

    const category = await Category.findByIdAndUpdate(id, newData, { new: true });

    res.json(category);
}

// Borrar Categoria
const deleteCategory = async (req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json({
        msg: 'OK',
        category
    })
}

module.exports = {
    createCategory,
    getCategoryById,
    updateCategory,
    getCategories,
    deleteCategory
}