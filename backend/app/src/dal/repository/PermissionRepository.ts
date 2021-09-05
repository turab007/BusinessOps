import IPermissionModel = require("./../../model/interfaces/IPermissionModel");
import PermissionSchema = require("./../dataAccess/schemas/PermissionSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * PermissionRepository 
 * 
 * @class PermissionRepository
 */
class PermissionRepository extends RepositoryBase<IPermissionModel> {

    constructor() {
        super(PermissionSchema);
    }

    findByModule(module_id) {

        return this._model.find({ module_id: module_id });
    }

    find(cond) {
        return this._model.find(cond);
    }
}

Object.seal(PermissionRepository);

export = PermissionRepository;