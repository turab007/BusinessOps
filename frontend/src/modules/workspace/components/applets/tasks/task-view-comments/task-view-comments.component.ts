import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { ErrorHandlerService } from '../../../../../shared';
import { FlashService } from 'modules/layout/services/flash.service';
import { TaskService, TaskGroup, Task, Comment, FormTaskCommentComponent, ActivityLogService } from '../../../../'
import { DeleteDialogComponent } from '../../../../../shared';


@Component({
  selector: 'app-task-view-comments',
  templateUrl: './task-view-comments.component.html',
  styleUrls: ['./task-view-comments.component.css']
})
export class TaskViewCommentsComponent implements OnInit {

  constructor(
    private _tasksService: TaskService,
    private fb: FormBuilder,
    private _dialogService: TdDialogService,
    public dialog: MatDialog,
    public _alService: ActivityLogService
  ) { }

  public commentForm: FormGroup; //FORMGROUP FOR COMMENTS
  public comments: Comment[]; //ARRAY OF COMMENTS
  public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED

  @Input() task: Task;  //CURRENT TASK
  @Input() taskGroup: TaskGroup; //CURRENT TASKGROUP

  @Output() refresh = new EventEmitter<any>();

  ngOnInit() {
    this.initCommentForm();
    this.comments = this.task.comments;
  }


  /**
   * GENERATES FORMGROUP
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
    this.commentForm.reset();
    if (isValid && model.comment) {
      this._tasksService.addComment(this.taskGroup.work_space, model, this.task).subscribe(task => {

        FlashService.instance.setFlashMessage("Comments", "Data saved");
        this.reloadTaskComments();
        this._alService.fetchLog();
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
    }

  }

  /**
   * PROVIDES FUNCTIONALITY TO EDIT COMMENT 
   * @param comment 
   */
  editComment(comment: Comment) {
    const data = {
      comment: comment,
      action: 'update'
    }
    this.createDialog(FormTaskCommentComponent, data).afterClosed().subscribe((result: Comment) => {
      // this.reloadWorkSpace();
      // this.dialogRefWorkSpace = null;
      if (result)
        comment.comment = result.comment;
      this._tasksService.updateComment(this.taskGroup.work_space, comment, this.task).subscribe(response => {
        FlashService.instance.setFlashMessage("OK", "Comment Updated");
        this._alService.fetchLog();

        // this.reloadTaskComments();

      }, error => {
        FlashService.instance.setFlashMessage("OK", "Something went wrong");

      })
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }

  /**
   * DELETES A COMMENT 
   * @param comment COMMENT TO BE DELETED
   */

  deleteComment(comment: Comment) {

    const data = {
      type: "comment",
      object: {name:comment.comment, _id:comment._id}
    }
    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._tasksService.removeComment(this.taskGroup.work_space, comment, this.task).subscribe(response => {
          FlashService.instance.setFlashMessage("OK", "Comment Removed");
          this.reloadTaskComments();
          this._alService.fetchLog();
        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");

        })

      }

    })


  }

  /**
   * Fetch task and its comments from service
  */
  private reloadTaskComments() {

    this._tasksService.findByIDAndGroup(this.taskGroup.work_space, this.task._id, this.taskGroup._id).subscribe(task => {
      // this.task = this.tasksService.getTask(tsId);
      this.comments = task.comments;
      this.commentForm.patchValue({ comment: '' });

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
