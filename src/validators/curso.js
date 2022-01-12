const { check } = require('express-validator') //TODO <---
const { validateResult } = require('../helpers/validateHelpers');

const validateCreateUpdateCurso = [ //TODO:name, age, email
    check('descripcion')
        .exists()
        .not()
        .isEmpty(),
    check('id_horario')
        .exists()
        .isNumeric(),
    check('id_instructor')
        .exists()
        .isNumeric(),           
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateInscribir = [ //TODO:name, age, email
    
    check('id_curso')
        .exists()
        .isNumeric(),
    check('id_alumno')
        .exists()
        .isNumeric(),           
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateCreateUpdateCurso, validateInscribir }