import {formatIpAddress} from "../modules/assist.js";

export function errorHandler(err, req, res, next) {
    console.error(err)
    if (!err.responseCode) {
        console.error("Processing request '%s %s' from '%s' failed:", req.method || "Unknown", req.originalUrl || "request", formatIpAddress(req.ip), err.message || err);
    }
    res.status(err.responseCode ? err.responseCode : 403).send(err)
}
