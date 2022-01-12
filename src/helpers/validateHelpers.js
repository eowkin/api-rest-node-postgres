const { validationResult } = require('express-validator'); //TODO:

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(422)
        res.send({ errors: err.array() })
    }
}


module.exports = { validateResult }