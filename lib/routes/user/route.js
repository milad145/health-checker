import express from 'express';

import UserService from './service.js';

const userService = new UserService;

import {errorCode} from "../../modules/errorHandler.js";
import {generateJWTToken, setErrorResponse} from "../../modules/assist.js";
import {loginValidation, registerValidation} from "./validation.js";
import {isValidRefreshToken} from "../../modules/middlewares.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const {error} = registerValidation.validate(req.body)
    if (error)
        return setErrorResponse(req, res, errorCode(400))

    let {username, password} = req.body;

    username = username.toLowerCase()
    try {
        let user = await userService.register(username, password)
        let {_id} = user
        res.send(_id)
    } catch (e) {
        setErrorResponse(req, res, e)
    }

});

router.post("/login", async (req, res) => {
    try {
        const {error} = loginValidation.validate(req.body)
        if (error)
            return setErrorResponse(req, res, errorCode(400))

        let {username, password} = req.body;
        username = username.toLowerCase()
        const {accessToken, refreshToken} = await userService.login(username, password)
        res.send({accessToken, refreshToken});
    } catch (e) {
        setErrorResponse(req, res, e)
    }
});

router.post('/refresh', isValidRefreshToken, async (req, res) => {
    const accessToken = generateJWTToken('access', req.user);
    res.json({accessToken})
});

export default router;
