import express from 'express';

import SignalService from './service.js';

import {errorCode} from "../../modules/errorHandler.js";
import {setErrorResponse} from "../../modules/assist.js";
import {isLogin} from "../../modules/middlewares.js";
import {calibrateValidation, estimateValidation, statusValidation} from "./validation.js";

const router = express.Router();

export default (rabbitMQService) => {
    const signalService = new SignalService(rabbitMQService);

    router.post("/calibrate", isLogin, async (req, res) => {
        try {
            const {error, value} = calibrateValidation.validate(req.body)
            if (error)
                throw errorCode(400);

            let {PPG, SBP, DBP, calibrateID} = value;
            const result = await signalService.calibration(calibrateID, PPG, SBP, DBP)
            res.json(result)
        } catch (e) {
            setErrorResponse(req, res, e)
        }
    });

    router.post("/estimate", isLogin, async (req, res) => {
        try {
            const {error, value} = estimateValidation.validate(req.body)
            if (error)
                throw errorCode(400);

            let {PPG, calibrateID} = value;
            let estimateID = await signalService.estimate(calibrateID, PPG)
            res.json({estimateID})
        } catch (e) {
            setErrorResponse(req, res, e)
        }
    });

    router.get("/status/:calibrateID/:estimateID", isLogin, async (req, res) => {
        try {
            const {error, value} = statusValidation.validate(req.params)
            if (error)
                throw errorCode(400);

            let {estimateID, calibrateID} = value;
            let result = await signalService.checkStatus(calibrateID, estimateID)
            res.json(result)
        } catch (e) {
            setErrorResponse(req, res, e)
        }
    });

    return router;
};
