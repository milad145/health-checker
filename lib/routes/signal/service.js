import {errorCode} from "../../modules/errorHandler.js";
import {generateRandomID} from "../../modules/assist.js";
import {getCalibrate, getEstimate, setCalibrate, setEstimate} from "../../data/collector.js"
//========================
const calibrates = {};
const estimates = {};
export default class SignalService {

    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
    }

    statusTranslate(status) {
        status = status + ""
        let steps = {
            "0": 3004,
            "-1": 3003,
            "1": 3002,
            "-2": 3005,
            "2": 3006,
            "-3": 3007,
            "3": 3008,
            "-4": 10,
            "4": 10,
            "-5": 10,
            "5": 10
        }
        return steps[status]
    }

    async calibration(calibrateID, PPG, SBP, DBP) {
        if (typeof calibrateID === "undefined") {
            calibrateID = generateRandomID(32)
            setCalibrate(calibrateID, {
                data: [],
                exp: Date.now() + (60 * 60 * 1000),
                status: 0
            })
        }
        let calibrate = getCalibrate(calibrateID)

        if (!calibrate)
            throw errorCode(3001)

        if (calibrate.status === -1)
            throw errorCode(this.statusTranslate(-1))

        if (calibrate.status > 0)
            throw errorCode(this.statusTranslate(1))

        calibrate.data.push({PPG, SBP, DBP})

        setCalibrate(calibrateID, calibrate)

        let signalLength = calibrate.data.length;

        if (signalLength === 3)
            await this.sendSignalToQueue(calibrateID)

        return {calibrateID, length: signalLength}
    }

    async sendSignalToQueue(calibrateID) {
        let calibrate = getCalibrate(calibrateID)
        try {
            console.log(calibrateID, new Date(calibrate.exp))
            await this.rabbitMQService.sendMessage("CalibrateQueue", {calibrateID, data: calibrate.data});
            delete calibrate.data
            calibrate.status = 2
        } catch (err) {
            console.error("Failed to send calibrate to RabbitMQ:", err);
            calibrate.status = -2; // Mark as failed
        }
        setCalibrate(calibrateID, calibrate)
    }

    async estimate(calibrateID, PPG) {
        try {
            let estimateMessage = {PPG}
            if (calibrateID) {
                let calibrate = getCalibrate(calibrateID)

                if (!calibrate)
                    throw errorCode(3001)

                if ([0, -1, -2, 2, -3].includes(calibrate.status))
                    throw errorCode(this.statusTranslate(calibrate.status))

                estimateMessage.calibrateID = calibrateID
            }
            let estimateID = generateRandomID(32)
            estimateMessage.estimateID = estimateID
            try {
                await this.rabbitMQService.sendMessage("EstimateQueue", estimateMessage);
            } catch (e) {
                throw errorCode(3009)
            }
            let estimate = {status: 0, exp: Date.now() + (60 * 60 * 1000)}
            setEstimate(estimateID, estimate)

            return estimateID;
        } catch (e) {
            console.error("Failed to send estimate to RabbitMQ:", e);
            throw e
        }
    }

    async checkStatus(calibrateID, estimateID) {
        let calibrate = getCalibrate(calibrateID)
        let estimate = getEstimate(estimateID)
        if (!calibrate)
            throw errorCode(3001)

        if (!estimate)
            throw errorCode(3012)

        if (!estimate.calibrateID || estimate.calibrateID !== calibrateID)
            throw errorCode(3013)

        const {status, DBP, SBP} = estimate;
        if (status === 1)
            return {status, DBP, SBP};
        else if (status === 0)
            throw errorCode(3014)
        else if (status === -1)
            throw errorCode(3015)
        else
            throw errorCode(400)
    }

    async checkEstimateStatus(estimateID) {
        let estimate = getEstimate(estimateID)

        if (!estimate)
            throw errorCode(3012)

        const {status, DBP, SBP} = estimate;
        if (status === 1)
            return {status, DBP, SBP};
        else if (status === 0)
            throw errorCode(3014)
        else if (status === -1)
            throw errorCode(3015)
        else
            throw errorCode(400)
    }

}

