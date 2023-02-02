const { Router } = require('express');
const { check } = require('express-validator');
const {
    createProduct,
    getProductById,
    updateProduct,
    getProducts,
    deleteProduct } = require('../controllers/products');
const { categoryExistsById } = require('../helpers/category-validators');
const { productExistsById } = require('../helpers/product-validators');
const { validateJWT, validateFields, hasRole } = require('../middlewares');

const router = Router();
// Todos los productos - publico
router.get('/', getProducts)

// Obtener un producto por ID - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], getProductById)

// Crear un producto - privado
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es una categoría válida').isMongoId(),
    check('category').custom(categoryExistsById),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], createProduct)

// Actualizar un producto - Admin
router.put('/:id', [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExistsById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es una categoría válida').isMongoId(),
    check('category').custom(categoryExistsById),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], updateProduct)

// borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExistsById),
    hasRole('SALES_ROLE', 'ADMIN_ROLE'),
    validateFields
], deleteProduct)


module.exports = router;