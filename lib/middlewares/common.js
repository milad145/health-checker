import {ObjectId} from "mongodb";
import {rateLimit} from 'express-rate-limit'
import {errorCode} from "../modules/errorHandler.js";


export const isValidObjectID = function (key) {
    return function (req, res, next) {
        let objectID = req.params[key]
        if (ObjectId.isValid(objectID)) {
            next()
        } else {
            next(errorCode(400))
        }
    }
}
/**
 *
 * @param max {number}
 * @param windows {number}
 * @returns {RateLimitRequestHandler}
 */
export const loginRateLimiter = function (max, windows = 15) {
    return rateLimit({
        windowMs: windows * 60 * 1000, // 24 min
        max: max, // Limit each IP to 10 login attempts per windowMs
        message: {
            responseCode: 429,
            messageCode: 2002,
            status: 429,
            message: 'تعداد درخواست‌های ورود از دستگاه شما بیش از حد مجاز شده است! پس از ۱۵ دقیقه دوباره تلاش کنید'
        },
        standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: true // Disable the `X-RateLimit-*` headers
    })
}
