/// <reference path="../../../../_all.d.ts" />
import IRead = require("./../interfaces/base/Read");
import IWrite = require("./../interfaces/base/Write");
import mongoose = require("mongoose");

/**
 * Base repository class for common methods implementation 
 * 
 * @class RepositoryBase
 */
class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

    protected _model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    count(cond?: Object) {
        return this._model.count(cond);
    }

    retrieve() {
        return this._model.find({})
    }

    find(cond: Object) {
        return this._model.find(cond)
    }

    findAllByAttributes(cond: Object) {
        return this._model.find(cond)
    }

    findById(_id: string) {
        return this._model.findById(_id);
    }

    findByAttribute(cond: Object) {
        return this._model.findOne(cond)
    }

    findHasManyRelation(cond?,relation?:string){
        let relationKey = relation +".$";
        let relationCond = {relationKey : 1};
        console.log(cond);
        console.log(relationCond);
        return this._model.findOne(cond,relationCond)
    }

    /**
     * Find latest record or last record
    */
    findLatestRecord() {
        return this._model.findOne({}, {}, { sort: { 'created_at': -1 } })
    }

    create(item: T) {
        return this._model.create(item);
    }
    /**
     * Create Many
     * @param items 
     */
    createMany(items:any[]) {
        return this._model.create(items);
    }

    update(_id: string, item: T, opts = { runValidators: true, new: false, context: 'query' }) {
        // console.log('===================inside update================',item,'======================opts==============',opts);
        return this._model.update({ _id: _id }, item, opts);
    }

    updateByCondition(cond: Object, item: T, opts = { runValidators: true, new: false, context: 'query' }) {
        return this._model.update(cond, item, opts);
    }

    findByIdAndUpdate(_id: string, item: T, opts = { runValidators: true, new: false, context: 'query' }) {
        return this._model.findByIdAndUpdate(_id, item, opts)
    }

    findAndUpdate(cond: Object, item: T, opts = { runValidators: true, new: false, context: 'query' }) {
        return this._model.findOneAndUpdate(cond, item, opts)
    }
    /**
     * 
     * @param docs 
     * @param item 
     */
    updateMany(docs,item){
        return this._model.update(docs,item,{multi:true})
    }

    delete(_id: string) {
        return this._model.findById(_id).then(instance => {
            return instance.remove();

        })
        // return this._model.remove({ _id: this.toObjectId(_id) });
    }

    deleteAllByAttributes(cond: Object) {
        return this._model.remove(cond);
    }
    aggregate(cond: Object) {
        return this._model.aggregate(cond);
    }
    /**
     * add many to many relation on one side
     * @param _id 
     * @param cond 
     *   {$pull: {projects: project._id}},  
     */
    removeManytoManyRelation(_id: string, cond) {
        return this._model.update({ '_id': _id }, cond);
    }
    /**
     * 
     * @param _id 
     * @param cond 
     *   {$push: {projects: project._id}},  
     */
    addeManytoManyRelation(_id: string, cond) {
   
        return this._model.update({ '_id': _id }, cond);
    }

    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id)
    }

    /**
     * Convert array of string _ids to mongoose instance _id array
     * @param arr 
     */
    public stringIdstoMongoIds(arr: any[]) {
        return arr.map(function (el) { return mongoose.Types.ObjectId(el) })
    }
    /**
    * convet mongos its to string ids
    * @param arr 
    */
    public mongoIdstostringIds(arr: any[]) {
        return arr.map(function (el) { return el.toString() })
    }

}

export = RepositoryBase;