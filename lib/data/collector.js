import {errorCode} from "../modules/errorHandler.js";

export default class CollectorService {
    constructor(redisService) {
        this.redisService = redisService
    }

    async getCalibrate(calibrateID) {
        return await this.redisService.getMessage(calibrateID)
    }

    async setCalibrate(calibrateID, calibrate) {
        return await this.redisService.saveMessage(calibrateID, calibrate, 60 * 60)
    }

    async getEstimate(estimateID) {
        return await this.redisService.getMessage(estimateID)
    }

    async setEstimate(estimateID, estimate) {
        return await this.redisService.saveMessage(estimateID, estimate, 60 * 60)
    }
}

export class ConsumeQueue {
    constructor(rabbitMQService, redisService) {
        this.rabbitMQService = rabbitMQService
        this.callectorService = new CollectorService(redisService)
    }

    calibrateConsumer() {
        try {
            return this.rabbitMQService.consumeMessage('CalibrateResultQueue', async (message) => {
                const {calibrateID, content, calibrateStatus} = message;
                let calibrate = await this.callectorService.getCalibrate(calibrateID)
                if (calibrate) {
                    if (calibrateStatus === 'OK') {
                        calibrate.status = 3
                    } else if (calibrateStatus === 'ERROR') {
                        calibrate.status = -3;
                        console.error(`calibrate error : ${calibrateID} : ${content}`)
                    } else
                        throw errorCode(3011)

                    await this.callectorService.setCalibrate(calibrateID, calibrate)
                } else
                    throw errorCode(3010)

            });
        } catch (err) {
            console.error("Failed to start RabbitMQ consumer:", err);
        }
    }

    estimateConsumer() {
        try {
            return this.rabbitMQService.consumeMessage('EstimateResultQueue', async (message) => {
                let estimate
                const {estimateID, content, estimateStatus, SBP, DBP} = message;
                if (estimateID)
                    estimate = await this.callectorService.getEstimate(estimateID)
                else
                    console.error('forgotten estimateID in the message')
                if (estimate) {
                    if (estimateStatus === 'OK') {
                        estimate.status = 1
                        estimate.SBP = SBP;
                        estimate.DBP = DBP;
                    } else if (estimateStatus === 'ERROR') {
                        estimate.status = -1;
                        console.error(`estimate error : ${estimateID} : ${content}`)
                    } else
                        throw errorCode(3011)

                    await this.callectorService.setEstimate(estimateID, estimate)
                } else
                    throw errorCode(3010)
            });
        } catch (err) {
            console.error("Failed to start RabbitMQ consumer:", err);
        }
    }

    startConsume() {
        this.calibrateConsumer();
        this.estimateConsumer();
    }
}
