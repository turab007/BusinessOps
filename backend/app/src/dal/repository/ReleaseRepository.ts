import IReleaseModel = require("./../../model/interfaces/IReleaseModel");
import ReleaseSchema = require("./../dataAccess/schemas/ReleaseSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * Release Repository 
 * 
 * @class ReleaseRepository
 */
class ReleaseRepository extends RepositoryBase<IReleaseModel> {

    constructor() {
        super(ReleaseSchema);
    }
}
export = ReleaseRepository;