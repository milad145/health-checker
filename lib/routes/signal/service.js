import {errorCode} from "../../modules/errorHandler.js";
import {generateRandomID} from "../../modules/assist.js";
//========================
const signals = {};
export default class SignalService {
    async calibration(id, ppg, sbp, dbp) {
        if (typeof id === "undefined") {
            id = generateRandomID(32)
            signals[id] = {
                data: [],
                exp: Date.now() + (60 * 60 * 1000),
                status: 0
            };
        }

        if (!signals[id])
            throw errorCode(3001)

        if (signals[id].status === -1)
            throw errorCode(3003)

        if (signals[id].status > 0)
            throw errorCode(3002)

        signals[id].data.push({ppg, sbp, dbp})

        let signalLength = signals[id].data.length;

        if (signalLength === 3) {
            this.sendSignalToQueue(id)
        }

        return {id, length: signalLength}
    }

    sendSignalToQueue(id) {
        console.log(id, new Date(signals[id].exp))
        delete signals[id].data
        signals[id].status = 1
    }

    async estimate(id, ppg) {
        let signal = signals[id]
        if (!signal)
            throw errorCode(3001)
        if (signal.status === -1)
            throw errorCode(3003)
        if (signal.status === 0)
            throw errorCode(3004)

        return true;
    }

    async checkStatus(signalID) {
        let signal = signals[signalID]
        if (!signal)
            throw errorCode(3001)

        const {status, id} = signal;
        return {status, id};
    }
}

setInterval(() => {
    Object.keys(signals).map(k => {
        if (signals[k].exp < Date.now() && signals[k].status === 0) {
            delete signals[k].data
            signals[k].status = -1
            console.log(`signal : ${k} is expired!`)
        }
    })
}, 10 * 1000)
