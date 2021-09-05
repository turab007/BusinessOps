import { IApprovalModel } from "./../../model/interfaces/barrel";
import ApprovalSchema = require("./../dataAccess/schemas/ApprovalSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * Approval Repository 
 * 
 * @class ApprovalRepository
 */
class ApprovalRepository extends RepositoryBase<IApprovalModel> {

    constructor() {
        super(ApprovalSchema);
    }
}
export = ApprovalRepository;