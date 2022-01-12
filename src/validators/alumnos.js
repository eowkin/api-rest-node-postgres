const { check } = require('express-validator') //TODO <---
const { validateResult } = require('../helpers/validateHelpers');

const validateCreate = [ //TODO:name, age, email
    check('nombre')
        .exists()
        .not()
        .isEmpty(),
    check('cedula')
        .exists()
        .not()
        .isEmpty(),
    check('direccion')
        .exists()
        .not()
        .isEmpty(),
    check('email')
        .exists()
        .isEmail(),            
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateCreate }