import _ = require('lodash-node');
import IBaseModel = require("../interfaces/base/IBaseModel");
import Pagination = require("./../../helpers/Pagination");

class BaseModel<T> implements IBaseModel<T>{

    protected _repo;

    constructor(repo) {
        this._repo = repo;
    }

    applyFilter(query, params) {

        if (params && params['filter']) {

            for (let key in params['filter']) {

                query.where(key).equals(new RegExp(params['filter'][key], 'i'));

            }
        }
        return query;
    }

    count(cond: Object, params: Object) {
        let query = this._repo.count(cond);

        query = this.applyFilter(query, params)

        return query;
    }
    /**
     * get Total count with any condition
     */
    getTotalCount() {
        return this._repo.count();
    }

    retrieve() {
        return this._repo.retrieve();
    }

    find(cond: Object) {

        return this._repo.find(cond);
    }
    findAll() {

        return this._repo.find();
    }

    search(cond: Object, params: Object, sortParams?: string) {

        let query = this.find(cond);
        // console.log("---------------------this is condition--------------",cond);
        // console.log("---------------------this is the query-------------- ",params);

        query = this.applyFilter(query, params)

        if (params && params['page']) {
            let page = new Pagination(params['page']);
            query.skip(page.skipRecords).limit(Number(page.pageSize));
        }
        if (sortParams) {
            query.sort({ sortParams: 1 });
        }

        else if (params) {
            query.sort({ 'first_name': 1 });
        }
        //e.g params['sort'] = {_id: 1 } ASC
        //e.g params['sort'] = {_id: -1 } DESC
        if (params['sort']) {
            query.sort(params['sort']);
        }

        /**TODO: Low (only selected columns will populated)**/
        if (params['select']) {
            query.select(params['select'])
        }

        return query;

        // if (params && params['filter']) {
        //     cond = params['filter'];
        // }
        // let page = new Pagination(params['page']);
        // return this.find(cond).skip(page.skipRecords).limit(Number(page.pageSize));
    }


    findAllByAttributes(cond) {
        return this._repo.findAllByAttributes(cond)
    }

    findById(_id: string) {
        return this._repo.findById(_id);
    }

    findByAttribute(cond?: Object) {
        return this._repo.findByAttribute(cond)
    }

    findHasManyRelation(cond?, relation?: string) {
        return this._repo.findHasManyRelation(cond, relation)
    }

    create(item: T) {
        return this._repo.create(this.omitEmptyData(item));
    }

    /**
     * Create Many
     * @param items 
    */
    createMany(items: any[]) {
        return this._repo.createMany(items);
    }

    update(_id: string, item: T) {
        // console.log('==================inside update func====================',item);
        return this._repo.update(_id, this.omitEmptyData(item));
    }

    updateByCondition(cond: Object, item: T) {
        return this._repo.updateByCondition(cond, item);
    }

    findByIdAndUpdate(_id: string, item: T) {
        return this._repo.findByIdAndUpdate(_id,item)
    }
    findAndUpdate(cond: Object, item: T) {
        return this._repo.findAndUpdate(cond, item)
    }

    updateMany(docs, item) {
        return this._repo.updateMany(docs, item);
    }

    /**
     * Find latest record or last record
    */
    findLatestRecord() {
        return this._repo.findLatestRecord();
    }

    delete(_id: string) {
        return this._repo.delete(_id);
    }

    deleteAllByAttributes(cond: Object) {
        return this._repo.deleteAllByAttributes(cond);
    }

    aggregate(cond: Object) {
        return this._repo.aggregate(cond);
    }
    /**
     * 
     * @param _id 
     * @param cond
     *    {$pull: {projects: project._id}},  
     */
    removeManytoManyRelation(_id: string, cond) {
        return this._repo.removeManytoManyRelation(_id, cond);
    }
    /**
     * 
     * @param _id 
     * @param cond
     *    {$push: {projects: project._id}},  
     */
    addeManytoManyRelation(_id: string, cond) {

        return this._repo.addeManytoManyRelation(_id, cond);
    }
    /**
     * Remove empty,null and undefined elements from object
     * @param item 
    */
    private omitEmptyData(item: T) {
        //|| _.isNull(v)
        return _.omit(item, function (v) { return _.isUndefined(v) || v == "" });
    }

    /**
        * Convert array of string _ids to mongoose instance _id array
        * @param arr 
    */
    public stringIdstoMongoIds(arr: any[]) {
        return this._repo.stringIdstoMongoIds(arr);
    }
    /**
        * Convert array of mongoose _ids to string instance _id array
        * @param arr 
        * @param unique
            ****** Make unique is true 

    */
    public mongoIdstostringIds(arr: any[], unique = false) {
        arr = this._repo.mongoIdstostringIds(arr);
        if (unique) {
            arr = _.uniq(arr);
            if (_.size(arr) == 0) {
                return null;
            }
        }
        return arr;
    }

}

export = BaseModel;