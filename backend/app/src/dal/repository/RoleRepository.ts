import IRoleModel = require("./../../model/interfaces/IRoleModel");
import RoleSchema = require("./../dataAccess/schemas/RoleSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * RoleRepository 
 * 
 * @class RoleRepository
 */
class RoleRepository extends RepositoryBase<IRoleModel> {

    constructor() {
        super(RoleSchema);
    }
}
export = RoleRepository;