/// <reference path="../../_all.d.ts" />
import PermissionChildrenRepository = require("./../dal/repository/PermissionChildrenRepository");
import IPermissionChildrenModel = require("./interfaces/IPermissionChildrenModel");
import BaseModel = require("./base/BaseModel");

/**
 * PermissionChildren Model
 * 
 * @class PermissionChildrenModel
 */
class PermissionChildrenModel extends BaseModel<IPermissionChildrenModel> {

    constructor() {
        super(new PermissionChildrenRepository());
    }

    findAllByAttributes(cond) {
        return this._repo.find(cond);
    }
}
Object.seal(PermissionChildrenModel);
export { PermissionChildrenModel };