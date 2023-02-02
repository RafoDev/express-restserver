const { response } = require("express");

const isAdminRole = (req, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el JWT primero'
        })
    }

    const { role, name } = req.user;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `Usuario '${name}' no tiene los permisos`
        })
    }

    next();
}
const hasRole = (...roles) => {
    return (req, res = response, next) => {
        const { role, name } = req.user;
        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}