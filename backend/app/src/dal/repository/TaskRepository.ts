import { ITaskModel } from "./../../model/interfaces/barrel";
import TaskSchema = require("./../dataAccess/schemas/TaskSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * Task Repository 
 * 
 * @class TaskRepository
 */
class TaskRepository extends RepositoryBase<ITaskModel> {

    constructor() {
        super(TaskSchema);
    }
}
export = TaskRepository;