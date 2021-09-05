import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { WorkspaceService, WorkSpace, TaskService } from '../../../../';
import { FlashService } from 'modules/layout/services/flash.service';
@Component({
  selector: 'app-assign-task-dialog',
  templateUrl: './assign-task-dialog.component.html',
  styleUrls: ['./assign-task-dialog.component.css','../stylesheets/task-styles.css'],
  providers: [WorkspaceService, TaskService]
})
export class AssignTaskDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AssignTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _workspaceService: WorkspaceService,
    private _taskService: TaskService) { }

  workspace: WorkSpace; //STORES CURRENT WORKSPACE
  user_roles; //USERS WITH ROLES IN CURRENT WORKSPACE

  ngOnInit() {
    console.log("in assigned task dialog ", this.data);

    this._workspaceService.findByID(this.data.ws).subscribe(res => {
      console.log('this is my workspace ', res);
      this.workspace = res;
      this.user_roles = res.user_role;
    })
  }

  /**
   * ASSIGNS TASK TO USER
   * @param user USER WHO WE WANT TO ASSIGN THE TASK TO
   */
  assignTask(user) {
    console.log("inside assign task func ", user, this.data, this.data.taskGroup);
    // let assigned_to = new FormControl();
    // assigned_to.setValue(user.id); 
    let model = {
      assigned_to: user.id
    }
    this._taskService.save(this.data.ws, model, this.data.object, this.data.parent).subscribe(task => {
      FlashService.instance.setFlashMessage("Task", "Data saved");
      this.dialogRef.close();
      // this._alService.fetchLog();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    })

  }

}
