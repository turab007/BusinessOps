import { Component, OnInit, Input } from '@angular/core';
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { FlashService } from 'modules/layout/services/flash.service';
import { TaskService, TaskGroup, Task, Attachment, ActivityLogService } from '../../../../'
import { DeleteDialogComponent } from '../../../../../shared';


@Component({
  selector: 'app-task-view-attachments',
  templateUrl: './task-view-attachments.component.html',
  styleUrls: ['./task-view-attachments.component.css'],
  providers: []
})
export class TaskViewAttachmentsComponent implements OnInit {

  constructor(
    public _alService: ActivityLogService,
    private _tasksService: TaskService,
    public dialog: MatDialog,
    private _dialogService: TdDialogService) { }

  public attachments: Attachment[]; //CONTAINS ALL ATTACHMENTS
  @Input() task: Task; //CURRENT TASK
  @Input() taskGroup: TaskGroup; //CURRENT TASKGROUP


  ngOnInit() {
    this.attachments = this.task.attachments;
  }



  /**
   * SAVE ATTACHMENT
   */
  saveAttachment(target: any) {

    if (target) {
      let fileList: FileList = target.files;
      let fileListLength = fileList.length;
      if (fileListLength > 0) {

        // Loop over all the attached files
        for (var i = 0; i < fileListLength; i++) {
          let formData: FormData = new FormData();
          formData.append("uploadFile[]", fileList[i]);

          this._tasksService.addAttachment(this.taskGroup.work_space, this.task, formData)
            .subscribe(response => {
              FlashService.instance.setFlashMessage("OK", "Attachment Uploaded");
              this.reloadAttachments();
              this._alService.fetchLog();
            },
            error => {
              FlashService.instance.setFlashMessage("OK", "Something went wrong");
            })
        }
      }
    }
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

  /**
   * FUNCTION TO DELETE ATTACHMENT
   * @param  
   * @param attach ATTACHMENT TO DELETE
   */

  deleteAttachment($event: any, attach: Attachment) {
    this.stopPropagation($event);

    const data = {
      type: "attachment",
      object: { name: attach.originalname, _id: attach._id }
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._tasksService.removeAttachment(this.taskGroup.work_space, attach, this.task).subscribe(response => {
          FlashService.instance.setFlashMessage("OK", "Attachment Removed");
          this.reloadAttachments();
          this._alService.fetchLog();
        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");

        })

      }
    })

  }

  /**
 * OPEN LINK TO THE ATTACHMENT
 */
  downloadAttachment(attach: Attachment) {
    this._tasksService.downloadAttachment(this.taskGroup.work_space, attach, this.task);


    //TODO: How to generate backend link for downloading attachment file
    // window.open('http://localhost:3000/' + attach.path);
  }

  /**
   * STOPS PROPOGATION OF EVENT
   * @param  
   */
  stopPropagation($event) {
    if ($event.stopPropagation) {
      // FOR IE 8+
      $event.stopPropagation();
    } else {
      // FOR IE < 8
      $event.returnValue = false;
    }
  }


  /**
   * Fetch task and its comments from service
  */
  private reloadAttachments() {

    this._tasksService.findByIDAndGroup(this.taskGroup.work_space, this.task._id, this.taskGroup._id).subscribe(task => {
      // this.task = this.tasksService.getTask(tsId);
      this.attachments = task.attachments;

    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

}
