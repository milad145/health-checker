import {ObjectId} from 'mongodb';

import {errorCode} from "./errorHandler.js";
import {setErrorResponse, validateJWTToken} from "./assist.js";

export const isValidObjectID = (key) => {
    return function (req, res, next) {
        let objectID = req.params[key]
        if (ObjectId.isValid(objectID)) {
            next()
        } else {
            let err = errorHandler.errorCode(400)
            assist.setErrorResponse(req, res, err)
        }
    }
}

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
