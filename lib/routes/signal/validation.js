import Joi from 'joi';

export const calibrateValidation = Joi.object({
    PPG: Joi.array().min(500).max(1024).items(
        Joi.number().min(-1).max(1).required()
    ).required(),
    SBP: Joi.number().min(71).max(200).required(),
    DBP: Joi.number().min(50).max(149).required(),
    calibrateID: Joi.string()
});

export const estimateValidation = Joi.object({
    PPG: Joi.array().min(500).max(1024).items(
        Joi.number().min(-1).max(1).required()
    ).required(),
    calibrateID: Joi.string().min(32).max(32).required()
});

export const statusValidation = Joi.object({
    calibrateID: Joi.string().min(32).max(32).required(),
    estimateID: Joi.string().min(32).max(32).required()
});
