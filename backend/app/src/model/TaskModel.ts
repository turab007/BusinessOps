/// <reference path="../../_all.d.ts" />
import TaskRepository = require("./../dal/repository/TaskRepository");
import { ITaskModel, ICommentModel, IAttachmentModel } from "./interfaces/barrel/";
import { AppletModel } from "./barrel/";
import BaseModel = require("./base/BaseModel");

var fs = require('fs');
/**
 * Task Model
 * 
 * @class TaskModel
 */
class TaskModel extends BaseModel<ITaskModel> {

    private _taskRepository: TaskRepository;

    constructor() {
        super(new TaskRepository());
        this._taskRepository = this._repo;
    }

    /**
     * 
     * @param task (will be Schema Object)
     * @param comment 
     * @param created_by 
     */
    public addComment(task: any, comment: ICommentModel, created_by: string) {
        comment.created_by = created_by
        task.comments.push(comment);
        return task.save();
    }

    public addAttachment(task: any, attachment: IAttachmentModel, created_by: string) {
        attachment.created_by = created_by;
        task.attachments.push(attachment);
        return task.save();
    }

    /**
     * 
     * @param task 
     * @param comment 
     * @param comment_id 
     */
    public updateComment(task: any, comment: ICommentModel, comment_id: string) {
        task.comments.id(comment_id).set(comment);
        return task.save();
    }

    /**
     * 
     * @param task 
     * @param comment_id 
     */
    public removeComment(task: any, comment_id: string) {
        task.comments.id(comment_id).remove();
        return task.save();
    }

    public getComment(task: any, comment_id: string) {
        return task.comments.id(comment_id);
    }

    public removeAttachment(task: any, attach_id: string) {
        
        fs.unlinkSync(this.getAttachment(task,attach_id).path);
        task.attachments.id(attach_id).remove();
        return task.save();
    }

    public getAttachment(task: any, attach_id: string) {
        return task.attachments.id(attach_id);
    }

    public findCommentsWithDescOrder() {

    }
}

Object.seal(TaskModel);
export { TaskModel };