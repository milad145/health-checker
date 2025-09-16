import bcrypt from "bcryptjs";
//========================
import {userModel} from "../../database/index.js";
import {generateJWTToken, getRandomNumberWithCustomDigits} from "../../modules/assist.js";
import {errorCode} from "../../modules/errorHandler.js";
//========================
export default class UserService {
    constructor({smsService}) {
        this.smsService = smsService
    }

    async login(phoneNumber, verifyCode) {
        const user = await userModel.getByQuery({phoneNumber}, {
            authorization: true
        }, {})

        if (!user) {
            throw errorCode(2002)
        }

        if (user['authorization']['failed'] >= 3) {
            throw errorCode(2004)
        }

        if (new Date(user['authorization']['expireDate']) < new Date()) {
            throw errorCode(2005)
        }

        const isCorrectPassword = await user.compareCode(verifyCode)
        if (!isCorrectPassword) {
            // if (!(phoneNumber === '09376336496' && verifyCode === '123456')) {
            await userModel.update({_id: user._id}, {$inc: {"authorization.failed": 1}})
            throw errorCode(2003)
            // }
        }

        return {
            accessToken: generateJWTToken('access', {
                _id: user._id
            }),
            refreshToken: generateJWTToken('refresh', {
                _id: user._id
            }),
            user: {
                _id: user._id
            }
        };

    }

    async requestNewCode(phoneNumber) {
        let user = await userModel.getByQuery({phoneNumber}, {authorization: 1})

        if (user && user.authorization) {
            const duration = Math.floor((user['authorization']['expireDate'] - new Date()) / (1000 * 60));

            if (duration >= 0)
                return true;
        }

        return this.getCode(phoneNumber)
    }

    async getCode(phoneNumber) {
        try {
            let query = {phoneNumber}
            let verifyCode = getRandomNumberWithCustomDigits(6).toString()
            const salt = await bcrypt.genSalt(10);
            const hashedCode = await bcrypt.hash(verifyCode, salt);

            await userModel.update(query, {
                $set: {
                    authorization: {
                        verifyCode: hashedCode,
                        expireDate: new Date(new Date().setMinutes(new Date().getMinutes() + 2)),
                        failed: 0
                    }
                }
            }, {upsert: true})

            try {
                await this.smsService.sendCode(phoneNumber, verifyCode)
            } catch (e) {
                throw errorCode(2401)
            }
            return true
        } catch (e) {
            throw e;
        }
    }

}
