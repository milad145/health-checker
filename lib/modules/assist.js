import crypto from 'crypto';
import jwt from 'jsonwebtoken'

import config from '../config/index.js';

export const appDir = process.env.PWD;

export const formatIpAddress = (address) => {
    if (typeof address === "string")
        return address.startsWith("::ff" + "ff:") ? address.slice(7) : address;
    else
        return "Unknown IP";
}

export const setErrorResponse = (req, res, err) => {
    if (!err.responseCode) {
        console.error("Processing request '%s %s' from '%s' failed:", req.method || "Unknown", req.originalUrl || "request", formatIpAddress(req.ip), err.message || err);
    }
    res.status(err.responseCode ? err.responseCode : 403).send(err)
}

export const generateRandomID = (d = 16) => {
    const digitsArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const numberArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    function generateCode(d) {
        let code = '';
        let digitsLength = 0;
        while (code.length < d) {
            if ((parseInt(crypto.randomBytes(1).toString('hex'), 16) % 2) && digitsLength < 2) {
                code += digitsArray[Math.floor(parseInt(crypto.randomBytes(4).toString('hex'), 16) / 4) % 23];
                digitsLength += 1;
            } else {
                code += numberArray[Math.floor(parseInt(crypto.randomBytes(4).toString('hex'), 16) / 4) % 9];
                digitsLength = 0;
            }
        }
        if (code.includes('sex'))
            code = generateCode(d)

        return code
    }

    return generateCode(d)
}

export const generateJWTToken = (type, data) => {
    data = JSON.parse(JSON.stringify(data))
    let secret = config[`${type}TokenSecret`];
    let expiresIn = config[`${type}TokenExpireTime`]
    if (secret && expiresIn) {
        return jwt.sign({data}, secret, {expiresIn})
    } else
        return ''
}

export const validateJWTToken = async (type, token) => {
    try {
        let secret = config[`${type}TokenSecret`];
        const {data} = await jwt.verify(token, secret);
        return data;
    } catch (e) {
        throw e
    }
}
