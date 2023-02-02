const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategoryById, updateCategory, getCategories, deleteCategory } = require('../controllers/categories');
const { categoryExistsById } = require('../helpers/category-validators');
const { validateJWT, validateFields, hasRole } = require('../middlewares');

const router = Router();
// Todas las categorias - publico
router.get('/', getCategories)

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], getCategoryById)

// Crear una categoria - privado
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], createCategory)

// Actualizar una categoria - Admin
router.put('/:id', [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExistsById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], updateCategory)

// borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExistsById),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], deleteCategory)





module.exports = router;