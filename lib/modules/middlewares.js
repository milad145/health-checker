import {ObjectId} from 'mongodb';

import {errorCode} from "./errorHandler.js";
import {setErrorResponse, validateJWTToken} from "./assist.js";

export const isLogin = async (req, res, next) => {
    let {authorization} = req.headers;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return setErrorResponse(req, res, errorCode(401))
    } else if (authorization && authorization.startsWith('Bearer')) {
        try {
            const user = await validateJWTToken('access', token);
            if (user && user._id) {
                req.user = user;
                next()
            } else {
                setErrorResponse(req, res, errorCode(401))
            }
        } catch (e) {
            setErrorResponse(req, res, errorCode(401))
        }
    }
}


export const isValidRefreshToken = async (req, res, next) => {
    let {authorization} = req.headers;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return setErrorResponse(req, res, errorCode(401))
    } else if (authorization && authorization.startsWith('Bearer')) {
        try {
            const user = await validateJWTToken('refresh', token);
            if (user && user._id) {
                req.user = user;
                next()
            } else {
                setErrorResponse(req, res, errorCode(401))
            }
        } catch (e) {
            setErrorResponse(req, res, errorCode(401))
        }
    }
}
