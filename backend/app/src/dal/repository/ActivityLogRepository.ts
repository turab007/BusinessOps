import { IActivityLogModel } from "./../../model/interfaces/barrel";
import ActivityLogSchema = require("./../dataAccess/schemas/ActivityLogSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * ActivityLogRepository 
 * 
 * @class ActivityLogRepository
 */
class ActivityLogRepository extends RepositoryBase<IActivityLogModel> {

    constructor() {
        super(ActivityLogSchema);
    }
}
export = ActivityLogRepository;