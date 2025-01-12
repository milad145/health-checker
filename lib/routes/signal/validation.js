import Joi from 'joi';

export const calibrateValidation = Joi.object({
    ppg: Joi.array().min(500).max(1024).items(
        Joi.number().min(0).max(1).required()
    ).required(),
    sbp: Joi.number().min(50).max(300).required(),
    dbp: Joi.number().min(30).max(200).required(),
    id: Joi.string()
});

export const estimateValidation = Joi.object({
    ppg: Joi.array().min(500).max(1024).items(
        Joi.number().min(0).max(1).required()
    ).required(),
    id: Joi.string().min(32).max(32).required()
});

export const statusValidation = Joi.object({
    id: Joi.string().min(32).max(32).required()
});
