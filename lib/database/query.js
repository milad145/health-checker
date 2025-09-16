export default class QueryModel {

    constructor(model) {
        this.model = model
    }

    create(params) {
        const object = new this.model(params);
        return object.save();
    }

    find(query = {}, project = {}, options = {},) {
        if (typeof options.sort === "undefined") options.sort = {'_id': -1}
        if (typeof options.limit === "undefined") options.limit = 30
        if (typeof options.skip === "undefined") options.skip = 0
        return this.model.find(query, project, options).sort(options.sort)
    }

    aggregate(pipeline = []) {
        return this.model.aggregate(pipeline)
    }

    count(query) {
        return this.model.countDocuments(query)
    }

    get(_id, project = {}) {
        return this.model.findById(_id, project, {})
    }

    getByQuery(query = {}, project = {}, options = {}) {
        return this.model.findOne(query, project, options)
    }

    update(query = {}, update = {}, options = {}) {
        if (options.multi) {
            return this.model.updateMany(query, update, options).set('updatedAt', new Date())
        } else {
            return this.model.findOneAndUpdate(query, update, options).set('updatedAt', new Date())
        }
    }

    delete(_id) {
        return this.model.deleteOne({_id})
    }
}
