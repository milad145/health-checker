import {errorCode} from "../../modules/errorHandler.js";
//========================
import UserQueries from '../../entities/user/service.js';
import {generateJWTToken} from "../../modules/assist.js";

const userQueries = new UserQueries;

//========================
export default class UserService {
    async register(username, password) {
        try {
            let user = await userQueries.getByQuery({username: {'$regex': `^${username}$`, $options: 'i'}}, {})
            if (user) {
                throw errorCode(2001)
            }

            let userObj = {
                username,
                createdAt: new Date(),
                password
            }

            return userQueries.create(userObj);
        } catch (e) {
            throw e
        }

    }

    async login(username, password) {
        try {
            let user = await userQueries.getByQuery({username: {'$regex': `^${username}$`, $options: 'i'}}, {
                password: true, username: true, status: true
            }, {})

            if (!user) {
                throw errorCode(2009)
            }
            await user.comparePassword(password, user['password'])
            if ([0, 1].includes(user['status'])) {
                const accessToken = generateJWTToken('access', {_id: user['_id']});
                const refreshToken = generateJWTToken('refresh', {_id: user['_id']});
                return {accessToken, refreshToken}
            } else if (user['status'] === -1)
                throw errorCode(2010)
            else
                throw errorCode(2009)

        } catch (e) {
            throw e
        }
    }
}
