/// <reference path="../../_all.d.ts" />
import TagRepository = require("./../dal/repository/TagRepository");
import ITagModel = require("./interfaces/ITagModel");
import BaseModel = require("./base/BaseModel");

/**
 * Tag Model
 * 
 * @class TagModel
 */
class TagModel extends BaseModel<ITagModel> {

    private _tagRepository: TagRepository;

    constructor() {
        super(new TagRepository());
        this._tagRepository = this._repo;
    }
    /**
     * Get All technologeis from tags
     */
    public getAllTechnologies() {
        //'Technologies' (is a Tag data_type)
        let cond = {
            $and: [
                { 'data_type': { $exists: true } },
                { 'data_type': { $ne: null } },
                { 'data_type': 'Technologies' },
            ]
        }

        return this.findAllByAttributes(cond).select('name _id').sort({ name: 'asc' }).then((result) => {
            return result;
        })
    }
    /**
     * Find technologies under in condition
     * @param technlogies 
     */
    public findTechnologies(technlogies) {
        //'Technologies' (is a Tag data_type)
        let cond = {
            $and: [
                { 'data_type': { $exists: true } },
                { 'data_type': { $ne: null } },
                { 'data_type': 'Technologies' },
                { '_id': { $in: technlogies } },
            ]
        }
        console.log(technlogies);
        console.log(cond);
        return this.findAllByAttributes(cond).select('name _id').sort({ name: 'asc' }).then((result) => {
            console.log(result);
            return result;
        })
    }


}

Object.seal(TagModel);
export { TagModel };