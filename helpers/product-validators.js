const { Product } = require("../models");

const productExistsById = async (id) => {
    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error(`El producto con id: ${id} no está registrado.`);
    }
}

module.exports = {
    productExistsById
}