export default class QueryModel {

    constructor(model) {
        this.model = model
    }

    create(params) {
        const object = new this.model(params);
        return object.save();
    }

    find(query = {}, project = {}, options = {}, populate) {
        if (typeof options.sort === "undefined") options.sort = {'_id': -1}
        if (typeof options.limit === "undefined") options.limit = 30
        if (typeof options.skip === "undefined") options.skip = 0

        if (typeof populate === "object")
            return this.model.find(query, project, options).sort(options.sort).populate(populate)
        else
            return this.model.find(query, project, options).sort(options.sort)
    }

    aggregate(pipeline = []) {
        return this.model.aggregate(pipeline)
    }

    count(query) {
        return this.model.countDocuments(query)
    }

    get(_id, project = {}, populate) {
        if (typeof populate === "object")
            return this.model.findById(_id, project, {}).populate(populate)
        else
            return this.model.findById(_id, project, {})
    }

    getByQuery(query = {}, project = {}, options = {}, populate) {
        if (typeof populate === "object")
            return this.model.findOne(query, project, options).populate(populate)
        else
            return this.model.findOne(query, project, options)
    }

    update(query = {}, update = {}, options = {}, populate) {
        if (options.multi) {
            return this.model.updateMany(query, update, options).set('updatedAt', new Date())
        } else {
            if (typeof populate === "object")
                return this.model.findOneAndUpdate(query, update, options).set('updatedAt', new Date()).populate(populate)
            else
                return this.model.findOneAndUpdate(query, update, options).set('updatedAt', new Date())
        }
    }

    delete(_id) {
        return this.model.deleteOne({_id})
    }
}
