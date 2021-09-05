/// <reference path="../../_all.d.ts" />
import ApprovalRepository = require("./../dal/repository/ApprovalRepository");
import { IApprovalModel, IAttachmentModel, ICommentModel } from "./interfaces/barrel/";
import { AppletModel, } from "./barrel/";
import BaseModel = require("./base/BaseModel");

var fs = require('fs');
/**
 * Approval Model
 * 
 * @class ApprovalModel
 */
class ApprovalModel extends BaseModel<IApprovalModel> {

    private _approvalRepository: ApprovalRepository;

    constructor() {
        super(new ApprovalRepository());
        this._approvalRepository = this._repo;
    }

    /**
     * 
     * @param approval (will be Schema Object)
     * @param comment 
     * @param created_by 
    */
    public addComment(approval: any, comment: ICommentModel, created_by: string) {
        comment.created_by = created_by
        approval.comments.push(comment);
        return approval.save();
    }

    public addAttachment(approval: any, attachment: any, created_by: string) {
        attachment.created_by = created_by;
        approval.attachments.push(attachment);
        return approval.save();
    }

    /**
     * 
     * @param approval 
     * @param comment 
     * @param comment_id 
    */
    public updateComment(approval: any, comment: ICommentModel, comment_id: string) {
        approval.comments.id(comment_id).set(comment);
        return approval.save();
    }
    
    /**
     * 
     * @param approval 
     * @param comment_id 
    */
    public removeComment(approval: any, comment_id: string) {
        approval.comments.id(comment_id).remove();
        return approval.save();
    }

    public getComment(approval: any, comment_id: string) {
        return approval.comments.id(comment_id);
    }

    public removeAttachment(task: any, attach_id: string) {

        fs.unlinkSync(this.getAttachment(task, attach_id).path);
        task.attachments.id(attach_id).remove();
        return task.save();
    }

    public getAttachment(task: any, attach_id: string) {
        return task.attachments.id(attach_id);
    }

    public findCommentsWithDescOrder() {

    }


}

Object.seal(ApprovalModel);
export { ApprovalModel };