import IWorkSpaceModel = require("./../../model/interfaces/IWorkSpaceModel");
import WorkSpaceSchema = require("./../dataAccess/schemas/WorkSpaceSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * WorkSpaceRepository 
 * 
 * @class WorkSpaceRepository
 */
class WorkSpaceRepository extends RepositoryBase<IWorkSpaceModel> {

    constructor() {
        super(WorkSpaceSchema);
    }
}
export = WorkSpaceRepository;