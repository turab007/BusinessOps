import IBusinessGroupModel = require("./../../model/interfaces/IBusinessGroupModel");
import BusinessGroupSchema = require("./../dataAccess/schemas/BusinessGroupSchema");
import RepositoryBase = require("./base/RepositoryBase");

class BusinessGroupRepository extends RepositoryBase<IBusinessGroupModel> {

    constructor() {
        super(BusinessGroupSchema);
    }

}

Object.seal(BusinessGroupRepository);
export = BusinessGroupRepository;