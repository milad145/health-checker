import {userModel} from "../../database/index.js";
import {generateJWTToken} from "../../modules/assist.js";
import {errorCode} from "../../modules/errorHandler.js";
//========================
export default class UserService {
    async register(username, password) {
        let user = await userModel.getByQuery({username: {'$regex': `^${username}$`, $options: 'i'}}, {})
        if (user) {
            throw errorCode(2001)
        }

        let userObj = {
            username,
            password
        }

        return userModel.create(userObj);
    }

    async login(username, password) {
        let user = await userModel.getByQuery({username: {'$regex': `^${username}$`, $options: 'i'}}, {
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

    }
}
