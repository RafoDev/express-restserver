const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete } = require('../controllers/user');
const { roleIsValid, emailIsUnique, userExistsById } = require('../helpers/db-validators');

const { validateFields, validateJWT, hasRole, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', userGet);
router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(roleIsValid),
    validateFields
], userPut)
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailIsUnique),
    check('role').custom(roleIsValid),
    validateFields
], userPost)
router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], userDelete)

module.exports = router;