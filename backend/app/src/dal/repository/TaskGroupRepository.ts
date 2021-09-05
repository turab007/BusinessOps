import { ITaskGroupModel } from "./../../model/interfaces/barrel";
import TaskGroupSchema = require("./../dataAccess/schemas/TaskGroupSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * TaskGroup Repository 
 * 
 * @class TaskGroupRepository
 */
class TaskGroupRepository extends RepositoryBase<ITaskGroupModel> {

    constructor() {
        super(TaskGroupSchema);
    }
}
export = TaskGroupRepository;