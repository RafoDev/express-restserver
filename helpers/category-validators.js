const { Category } = require("../models");

const categoryExistsById = async (id) => {
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new Error(`La categoría con id: ${id} no está registrada.`);
    }
}

module.exports = {
    categoryExistsById
}