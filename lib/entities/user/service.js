import mongoose from 'mongoose';
import _ from "lodash";
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
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(options.sort) ? true : options.sort = {'_id': -1}
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;
        // query.status = 1;
        if (options.populate)
            return userModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
        // .populate({path: 'blockList', select: 'avatar username fname lname'});
        else
            return userModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip))
    }


    cursor(query, project, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(options.sort) ? true : options.sort = {'_id': -1}
        !_.isUndefined(options.limit) ? true : options.limit = 30;
        !_.isUndefined(options.skip) ? true : options.skip = 0;

        if (options.populate)
            return userModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip)).cursor()
        else
            return userModel.find(query, project)
                .sort(options.sort).limit(parseInt(options.limit)).skip(parseInt(options.skip)).cursor();
    }

    aggregate(pipline) {
        !_.isUndefined(pipline) ? true : pipline = [];
        return userModel.aggregate(pipline)
    }

    count(query) {
        !_.isUndefined(query) ? true : query = {};
        // query.status = 1;
        return userModel.countDocuments(query)
    }

    get(id, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(options) ? true : options = {};
        if (options.populate)
            return userModel.findOne({_id: id}, project)
        else
            return userModel.findOne({_id: id}, project)
    }

    getByQuery(query, project, options) {
        !_.isUndefined(project) ? true : project = {};
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        return userModel.findOne(query, project)
    }

    update(query, update, options) {
        !_.isUndefined(query) ? true : query = {};
        !_.isUndefined(options) ? true : options = {};
        !_.isUndefined(options.new) ? true : options.new = true;
        !_.isUndefined(options.multi) ? true : options.multi = false;
        update.modifiedAt = new Date();
        if (options.multi) {
            return userModel.updateMany(query, update, options)
        } else {
            return userModel.findOneAndUpdate(query, update, options)
        }
    }

}

