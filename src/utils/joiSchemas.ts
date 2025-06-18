import Joi from "joi";

export const EmployeeDtoSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    id: Joi.string().length(9).required(),
})
export const NewPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required()
})

export const joiSchemas = {
    'POST/accounts' : EmployeeDtoSchema,
    'PUT/accounts' : EmployeeDtoSchema,
    'PATCH/accounts/account' : NewPasswordSchema

}