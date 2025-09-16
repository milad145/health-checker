import {errorCode} from "../modules/errorHandler.js";
import {validateJWTToken} from "../modules/assist.js";

export const isLogin = async (req, res, next) => {
    let {authorization} = req.headers;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return next(errorCode(401))
    } else if (authorization?.startsWith('Bearer')) {
        try {
            const user = await validateJWTToken('access', token);
            if (user?._id) {
                req.user = user;
                next()
            } else {
                next(errorCode(401))
            }
        } catch (e) {
            next(errorCode(401))
        }
    }
}

export const isValidRefreshToken = async (req, res, next) => {
    let {authorization} = req.headers;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return next(errorCode(401))
    } else {
        try {
            const user = await validateJWTToken('refresh', token);
            if (user && user._id) {
                req.user = user;
                next()
            } else {
                next(errorCode(401))
            }
        } catch (e) {
            next(errorCode(401))
        }
    }
}
