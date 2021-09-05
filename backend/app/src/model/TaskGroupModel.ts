/// <reference path="../../_all.d.ts" />
import TaskGroupRepository = require("./../dal/repository/TaskGroupRepository");
import { ITaskGroupModel } from "./interfaces/barrel/";
import { AppletModel } from "./barrel/";
import BaseModel = require("./base/BaseModel");

/**
 * TaskGroup Model
 * 
 * @class TaskGroupModel
 */
class TaskGroupModel extends BaseModel<ITaskGroupModel> {

    private _taskGroupRepository: TaskGroupRepository;

    constructor() {
        super(new TaskGroupRepository());
        this._taskGroupRepository = this._repo;
    }

   
}

Object.seal(TaskGroupModel);
export { TaskGroupModel };