import IPermissionChildrenModel = require("./../../model/interfaces/IPermissionChildrenModel");
import PermissionChildrenSchema = require("./../dataAccess/schemas/PermissionChildrenSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * PermissionChildrenRepository 
 * 
 * @class PermissionChildrenRepository
 */
class PermissionChildrenRepository extends RepositoryBase<IPermissionChildrenModel> {

    constructor() {
        super(PermissionChildrenSchema);
    }

    /**
     * 
     * @param cond 
     */
    find(cond) {
        return this._model.find(cond);
    }
}

Object.seal(PermissionChildrenRepository);

export = PermissionChildrenRepository;