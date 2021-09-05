import ReleaseRepository = require("./../dal/repository/ReleaseRepository");
import IReleaseModel = require("./interfaces/IReleaseModel");
import BaseModel = require("./base/BaseModel");

/**
 * Release Model
 * 
 * @class ReleaseModel
 */
class ReleaseModel extends BaseModel<IReleaseModel> {

    private _releaseRepo: ReleaseRepository;

    constructor() {
        super(new ReleaseRepository());
        this._releaseRepo = this._repo;
    }


}

Object.seal(ReleaseModel);
export { ReleaseModel };