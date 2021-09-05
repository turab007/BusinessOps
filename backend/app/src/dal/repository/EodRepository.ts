import { IEodModel } from "./../../model/interfaces/barrel";
import EodSchema = require("./../dataAccess/schemas/EodSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * ActivityLogRepository 
 * 
 * @class ActivityLogRepository
 */
class EodRepository extends RepositoryBase<IEodModel> {

    constructor() {
        super(EodSchema);
    }
}
export = EodRepository;