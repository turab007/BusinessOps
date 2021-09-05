/// <reference path="../../_all.d.ts" />
import BusinessGroupRepository = require("./../dal/repository/BusinessGroupRepository");
import IBusinessGroupModel = require("./interfaces/IBusinessGroupModel");
import BaseModel = require("./base/BaseModel");

/**
 * BusinessGroup Model
 * 
 * @class BusinessGroupModel
 */
class BusinessGroupModel extends BaseModel<IBusinessGroupModel> {

    private _businessGroupRepository: BusinessGroupRepository;

    constructor() {
        super(new BusinessGroupRepository());
        this._businessGroupRepository = this._repo;
    }

}

Object.seal(BusinessGroupModel);
export { BusinessGroupModel };