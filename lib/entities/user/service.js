import mongoose from 'mongoose';
//========================
import UserSchema from './schema.js';

const userModel = mongoose.model('user', UserSchema);

//========================
export default class UserQueries {

    /**
     * Create User
     * @param params {Object}
     * @returns {*}
     */

    create(params) {
        if (typeof params.createdAt === "undefined")
            params.createdAt = new Date();
        const userObject = new userModel(params);
        return userObject.save()
    }

    find(query, project, options) {
        return userModel.find(query, project)
            .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }


    cursor(query, project, options) {
        return userModel.find(query, project)
            .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip)).cursor()
    }

    aggregate(pipline) {
        return userModel.aggregate(pipline)
    }

    count(query) {
        return userModel.countDocuments(query)
    }

    get(id, project, options) {
        return userModel.findOne({_id: id}, project)
    }

    getByQuery(query, project, options) {
        return userModel.findOne(query, project, options)
    }

    update(query, update, options) {
        if (options.multi) {
            return userModel.updateMany(query, update, options)
        } else {
            return userModel.findOneAndUpdate(query, update, options)
        }
    }

}

