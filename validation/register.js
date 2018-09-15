const validator = require('validator');
const isempty = require('./is-empty');

module.exports = function validateRegisterInput(data){
    let errors = {};
    if(!validator.isLength(data.name, {min: 2, max: undefined})){
        errors.name = "Name must be more than 2 characters";
    }
    return {
        errors,
        isValid: isempty(errors)
    }
}