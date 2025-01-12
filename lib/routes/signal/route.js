import express from 'express';

import SignalService from './service.js';

const signalService = new SignalService;

import {errorCode} from "../../modules/errorHandler.js";
import {setErrorResponse} from "../../modules/assist.js";
import {isLogin} from "../../modules/middlewares.js";
import {calibrateValidation, estimateValidation, statusValidation} from "./validation.js";

const router = express.Router();

router.post("/calibrate", isLogin, async (req, res) => {
    try {
        const {error, value} = calibrateValidation.validate(req.body)
        if (error)
            throw errorCode(400);

        let {ppg, sbp, dbp, id} = value;
        const result = await signalService.calibration(id, ppg, sbp, dbp)
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

        let {ppg, id} = value;
        await signalService.estimate(id, ppg)
        res.send('ok')
    } catch (e) {
        setErrorResponse(req, res, e)
    }
});

router.get("/status/:id", isLogin, async (req, res) => {
    try {
        const {error, value} = statusValidation.validate(req.params)
        if (error)
            throw errorCode(400);

        let {id} = value;
        let result = await signalService.checkStatus(id)
        res.json(result)
    } catch (e) {
        setErrorResponse(req, res, e)
    }
});


export default router;
