import IStatusFlowModel = require("./../../model/interfaces/IStatusFlowModel");
import StatusFlowSchema = require("./../dataAccess/schemas/StatusFlowSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * StatusFlow Repository 
 * 
 * @class StatusFlowRepository
 */
class StatusFlowRepository extends RepositoryBase<IStatusFlowModel> {

    constructor() {
        super(StatusFlowSchema);
    }
}
export = StatusFlowRepository;