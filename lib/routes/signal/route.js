import express from 'express';

import SignalService from './service.js';

import {errorCode} from "../../modules/errorHandler.js";
import {isLogin} from "../../middlewares/authentication.js";
import {calibrateValidation, estimateStatusValidation, estimateValidation, statusValidation} from "./validation.js";

export default ({rabbitMQService, redisService}) => {
    const router = express.Router();

    const signalService = new SignalService({rabbitMQService, redisService});

    router.post("/calibrate", isLogin, async (req, res, next) => {
        try {
            const {error, value} = calibrateValidation.validate(req.body)
            if (error)
                return next(errorCode(400));

            let {PPG, SBP, DBP, calibrateID} = value;
            const result = await signalService.calibration(calibrateID, PPG, SBP, DBP)
            res.json(result)
        } catch (e) {
            next(e)
        }
    });

    router.post("/estimate", isLogin, async (req, res, next) => {
        try {
            const {error, value} = estimateValidation.validate(req.body)

            if (error)
                return next(errorCode(400));

            let {PPG, calibrateID} = value;
            let estimateID = await signalService.estimate(calibrateID, PPG)
            res.json({estimateID})
        } catch (e) {
            next(e)
        }
    });

    router.get("/status/:calibrateID/:estimateID", isLogin, async (req, res, next) => {
        try {
            const {error, value} = statusValidation.validate(req.params)
            if (error)
                return next(errorCode(400));

            let {estimateID, calibrateID} = value;
            let result = await signalService.checkStatus(calibrateID, estimateID)
            res.json(result)
        } catch (e) {
            next(e)
        }
    });

    router.get("/status/:estimateID", isLogin, async (req, res, next) => {
        try {
            const {error, value} = estimateStatusValidation.validate(req.params)
            if (error)
                return next(errorCode(400));

            let {estimateID} = value;
            let result = await signalService.checkEstimateStatus(estimateID)
            res.json(result)
        } catch (e) {
            next(e)
        }
    });

    return router;
};
