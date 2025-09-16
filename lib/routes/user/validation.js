import Joi from 'joi';

export const verifyCodeValidation = Joi.object({
    phoneNumber: Joi.string().pattern(/^(09\d{9})$/).required(),
});

export const loginValidation = Joi.object({
    phoneNumber: Joi.string().pattern(/^(09\d{9})$/).required(),
    verifyCode: Joi.string().pattern(/^(\d{6})$/).required()
});
