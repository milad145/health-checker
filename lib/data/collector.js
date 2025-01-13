import {errorCode} from "../modules/errorHandler.js";

const calibrates = {};
const estimates = {};

export const getCalibrate = (calibrateID) => calibrates[calibrateID]

export const setCalibrate = (calibrateID, calibrate) => {
    calibrates[calibrateID] = calibrate
}

export const getEstimate = (estimateID) => estimates[estimateID]

export const setEstimate = (estimateID, estimate) => {
    estimates[estimateID] = estimate
}

export class ConsumeQueue {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService
    }

    calibrateConsumer() {
        try {
            return this.rabbitMQService.consumeMessage('CalibrateResultQueue', (message) => {
                const {calibrateID, content, calibrateStatus} = message;
                let calibrate = getCalibrate(calibrateID)
                if (calibrate) {
                    if (calibrateStatus === 'OK') {
                        calibrate.status = 3
                    } else if (calibrateStatus === 'ERROR') {
                        calibrate.status = -3;
                        console.error(`calibrate error : ${calibrateID} : ${content}`)
                    } else
                        throw errorCode(3011)

                    setCalibrate(calibrateID, calibrate)
                } else
                    throw errorCode(3010)

            });
        } catch (err) {
            console.error("Failed to start RabbitMQ consumer:", err);
        }
    }

    estimateConsumer() {
        try {
            return this.rabbitMQService.consumeMessage('EstimateResultQueue', (message) => {
                const {calibrateID, estimateID, content, estimateStatus, SBP, DBP} = message;
                let calibrate = getCalibrate(calibrateID)
                let estimate = getEstimate(estimateID)
                if (calibrate && estimate) {
                    if (estimateStatus === 'OK') {
                        estimate.status = 1
                        estimate.SBP = SBP;
                        estimate.DBP = DBP;
                    } else if (estimateStatus === 'ERROR') {
                        calibrate.status = -1;
                        console.error(`calibrate error : ${calibrateID} : ${content}`)
                    } else
                        throw errorCode(3011)

                    setEstimate(estimateID, estimate)
                } else
                    throw errorCode(3010)
            });
        } catch (err) {
            console.error("Failed to start RabbitMQ consumer:", err);
        }
    }

    deleteExpiredCalibrates() {
        setInterval(() => {
            Object.keys(calibrates).map(k => {
                if (calibrates[k].exp < Date.now() && calibrates[k].status === 0) {
                    delete calibrates[k].data
                    calibrates[k].status = -1
                    console.log(`signal : ${k} is expired!`)
                }
            })
        }, 10 * 1000)
    }

    deleteExpiredEstimates() {
        setInterval(() => {
            Object.keys(estimates).map(k => {
                if (estimates[k].exp < Date.now() && estimates[k].status === 0) {
                    delete estimates[k].data
                    estimates[k].status = -1
                    console.log(`signal : ${k} is expired!`)
                }
            })
        }, 10 * 1000)
    }

    startConsume() {
        this.calibrateConsumer();
        this.estimateConsumer();
        this.deleteExpiredCalibrates();
    }
}
