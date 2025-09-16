import express from 'express';

import UserService from './service.js';
import {errorCode} from "../../modules/errorHandler.js";
import {generateJWTToken} from "../../modules/assist.js";
import {loginValidation, verifyCodeValidation} from "./validation.js";
import {isValidRefreshToken} from "../../middlewares/authentication.js";
import {loginRateLimiter} from "../../middlewares/common.js";

export default function ({smsService}) {
    const userService = new UserService({smsService});
    const router = express.Router();

    router.post("/login", async (req, res, next) => {
        try {
            const {error} = loginValidation.validate(req.body)
            if (error)
                return next(errorCode(400))

            const {phoneNumber, verifyCode} = req.body;
            const {accessToken, refreshToken} = await userService.login(phoneNumber, verifyCode)
            res.send({accessToken, refreshToken});
        } catch (e) {
            next(e)
        }
    });

    // Login (same for both roles)
    router.post("/login/code", loginRateLimiter(5, 15), async (req, res, next) => {
        try {
            const {error} = verifyCodeValidation.validate(req.body)
            if (error)
                return next(errorCode(400))
            const {phoneNumber} = req.body;
            await userService.requestNewCode(phoneNumber)

            res.send(true);
        } catch (e) {
            next(e)
        }
    });

    router.post('/refresh', isValidRefreshToken, async (req, res, next) => {
        const accessToken = generateJWTToken('access', req.user);
        res.json({accessToken})
    });

    return router;
}
