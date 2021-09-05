import { Component, OnInit, Input } from '@angular/core';
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { FlashService } from 'modules/layout/services/flash.service';
import { ApprovalService, Approval, Attachment, ActivityLogService } from '../../../../'
import { DeleteDialogComponent } from '../../../../../shared';

@Component({
  selector: 'app-approval-view-attachments',
  templateUrl: './approval-view-attachments.component.html',
  styleUrls: ['./approval-view-attachments.component.css']
})
export class ApprovalViewAttachmentsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _approvalService: ApprovalService,
    private _dialogService: TdDialogService,
    public _alService: ActivityLogService
  ) { }

  public attachments: Attachment[]; //ALL ATTACHMENT OF APPROVAL
  @Input() approval: Approval; //CURRENT APPROVAL
  // @Input() taskGroup: TaskGroup;

  ngOnInit() {
    this.attachments = this.approval.attachments;

  }

  /**
   * add comment 
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

          this._approvalService.addAttachment(this.approval.work_space._id, this.approval, formData)
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
   * DELETE AN ATTACHMENT
   * @param  
   * @param attach ATTACHMENT TO BE DELETED
   */
  deleteAttachment($event: any, attach: Attachment) {
    this.stopPropagation($event);

    const data = {
      type: "attachment",
      object: { name: attach.originalname, _id: attach._id }
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._approvalService.removeAttachment(this.approval.work_space._id, attach, this.approval).subscribe(response => {
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
 * OPEN LINK TO THE ATTACHMENT
 */
  downloadAttachment(attach: Attachment) {
    this._approvalService.downloadAttachment(this.approval.work_space._id, attach, this.approval);


    //TODO: How to generate backend link for downloading attachment file
    // window.open('http://localhost:3000/' + attach.path);
  }

  /**
   * STOP PROPOGATION OF EVENT
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

    console.log("this is approval ", this.approval);

    this._approvalService.findByID(this.approval).subscribe(task => {
      // this.task = this.tasksService.getTask(tsId);
      this.attachments = task.attachments;

    }, error => {
      FlashService.instance.setFlashMessage("OK", "Something went wrong");

    });
  }


}
