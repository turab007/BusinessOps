import IUserBusinessGroupModel = require("./../../model/interfaces/IUserBusinessGroupModel");
import UserBusinessGroupSchema = require("./../dataAccess/schemas/UserBusinessGroupSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * UserBusinessGroupRepository 
 * 
 * @class UserBusinessGroupRepository
 */
class UserBusinessGroupRepository extends RepositoryBase<IUserBusinessGroupModel> {

    constructor() {
        super(UserBusinessGroupSchema);
    }
}

Object.seal(UserBusinessGroupRepository);

export = UserBusinessGroupRepository;