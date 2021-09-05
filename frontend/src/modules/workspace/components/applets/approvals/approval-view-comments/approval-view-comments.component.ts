import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";

import { FlashService } from '../../../../../layout';
import { ApprovalService, Approval, Comment, FormApprovalCommentComponent, WorkSpace, ActivityLogService } from '../../../../'
import { DeleteDialogComponent } from '../../../../../shared';


@Component({
  selector: 'app-approval-view-comments',
  templateUrl: './approval-view-comments.component.html',
  styleUrls: ['./approval-view-comments.component.css']
})
export class ApprovalViewCommentsComponent implements OnInit {

  constructor(
    private _approvalService: ApprovalService,
    private fb: FormBuilder,
    private _dialogService: TdDialogService,
    public dialog: MatDialog,
    public _alService: ActivityLogService) { }

  public commentForm: FormGroup; //FORMGROUP FOR COMMENT FORM
  public comments: Comment[]; //ALL COMMENTS OF APPROVAL
  public submitted: boolean; //IF FORM IS SUBMITTED
  @Input() approval: Approval;  //CURRENT APPROVAL
  // @Input() ws: WorkSpace;

  @Output() refresh = new EventEmitter<any>();



  ngOnInit() {
    this.initCommentForm();
    this.comments = this.approval.comments;
  }


  /**
   * GENERATE FORM CONTROLS
   */
  initCommentForm() {
    this.commentForm = this.fb.group({
      comment: ['']
    });
  }


  /**
   * add comment
   * @param model 
   * @param isValid 
   */
  saveComment(model: Comment, isValid: boolean) {
    this.submitted = true;
    if (isValid && model.comment) {
      this._approvalService.addComment(model, this.approval).subscribe(approval => {
        this.commentForm.patchValue({ comment: '' });
        this.commentForm.reset();
        this.reloadApprovalComments();
        this._alService.fetchLog();
        FlashService.instance.setFlashMessage("OK", "Comment saved");

      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
    }

  }
  /**
   * SAVE COMMENTS
   * @param comment COMMENT TO BE SAVED 
   */
  editComment(comment: Comment) {
    const data = {
      comment: comment,
      action: 'update'
    }

    this.createDialog(FormApprovalCommentComponent, data).afterClosed().subscribe((result: Comment) => {
      // this.reloadWorkSpace();
      // this.dialogRefWorkSpace = null;
      if (result) {

        comment.comment = result.comment;
        this._approvalService.updateComment(comment, this.approval).subscribe(response => {
          FlashService.instance.setFlashMessage("OK", "Comment Updated");
          this._alService.fetchLog();

          // this.reloadApprovalComments();

        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");

        })
      }
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  /**
   *DELETE COMMENT 
   * @param comment COMMENT TO BE DELETED 
   */
  deleteComment(comment: Comment) {

    const data = {
      type: "comment",
      object: { name: comment.comment, _id: comment._id }
    }
    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._approvalService.removeComment(comment, this.approval).subscribe(response => {

          FlashService.instance.setFlashMessage("OK", "Comment Removed");
          this.reloadApprovalComments();
          this._alService.fetchLog();
        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");

        })
      }
    })
  }

  /**
   * Fetch approval and its comments from service
  */
  private reloadApprovalComments() {

    this._approvalService.findByID(this.approval).subscribe(approval => {
      if (approval) {
        this.comments = this.approval.comments = approval.comments;
      }
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }


  /**
  * Open any dialog
  * @param component Dialog Component to open
  * @param data Optional data to pass along
  */
  private createDialog(component, data?: any, width: string = '600px', disableClose: boolean = false) {
    const dialogRef = this.dialog.open(component, { panelClass: 'full-width-dialog' });
    const instance: any = dialogRef.componentInstance;
    instance.width = width;
    instance.disableClose = disableClose;
    instance.data = data;
    return dialogRef;
  }

}
