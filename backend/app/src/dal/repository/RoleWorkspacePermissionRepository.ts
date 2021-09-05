import IRoleWorkspacePermission = require("./../../model/interfaces/IRoleWorkspacePermission");
import RoleWorkspacePermissionSchema = require("./../dataAccess/schemas/RoleWorkspacePermissionSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * RolePermissionRepository 
 * 
 * @class RolePermissionRepository
 */
class RoleWorkspacePermissionRepository extends RepositoryBase<IRoleWorkspacePermission> {

    constructor() {
        super(RoleWorkspacePermissionSchema);
    }

    find(cond) {
        return this._model.find(cond);
    }
}

Object.seal(RoleWorkspacePermissionRepository);

export = RoleWorkspacePermissionRepository;