import IUserRoleModel = require("./../../model/interfaces/IUserRoleModel");
import UserRoleSchema = require("./../dataAccess/schemas/UserRoleSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * UserRoleRepository 
 * 
 * @class UserRoleRepository
 */
class UserRoleRepository extends RepositoryBase<IUserRoleModel> {

    constructor() {
        super(UserRoleSchema);
    }
}

Object.seal(UserRoleRepository);

export = UserRoleRepository;