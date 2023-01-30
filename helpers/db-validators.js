const Role = require('../models/role');
const User = require('../models/user');

const roleIsValid = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${role} no está registrado en la BD.`);
    }
}

const emailIsUnique = async (email = '') => {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error('Ese correo ya está registrado.');
    }
}

const userExistsById = async (id) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`El usuario con id: ${id} no está registrado.`);
    }
}



module.exports = {
    roleIsValid,
    emailIsUnique,
    userExistsById
}