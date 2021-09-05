import { Component, OnInit, Input, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { _ } from 'lodash-node';
import { FlashService } from 'modules/layout/services/flash.service';
import { TaskService, Task, TaskGroup, ActivityLogService, WorkspaceService, WorkSpace } from '../../../../'
import { UserService, User } from '../../../../../settings';
import { ErrorHandlerService } from '../../../../../shared';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-task-edit-info',
  templateUrl: './task-edit-info.component.html',
  styleUrls: ['./task-edit-info.component.css','../stylesheets/task-styles.css'],
  providers: [UserService, ErrorHandlerService, WorkspaceService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEditInfoComponent implements OnInit {

  constructor(private _tasksService: TaskService,
    private _alService: ActivityLogService,
    private route: ActivatedRoute, private router: Router,
    private _userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private _workspaceService: WorkspaceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskEditInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public statusList: any[] = []; //LIST OF ALL STATUSES
  public priorityList: any[] = []; //LIST OF ALL PRIORITIES
  public infoForm: FormGroup; //FORMGROUP OF INFOFORM
  // public users; //ARRAY OF ALL USERS
  public currentUser: User; //CURRENT USER
  task: Task; //CURRENT TASK
  taskGroup: TaskGroup; //CURRENT TASKGROUP
  public workspace: WorkSpace; //CURRENT WORKSPACE
  public user_roles; //ALL USERS IN CURRENT WORKSPACE


  ngOnInit() {
    this.fetchTaskDefaultStatuses();

    this.task = this.data.object;
    this.taskGroup = this.data.parent;
    console.log("this is task ", this.task);
    this.initInfoForm();

    this.getWorkSpaceUsers();

    this.getLoggedInUser();
  }

  /**
   * GETS CURRENT WORKSPACE AND ALL ITS USERS
   */
  getWorkSpaceUsers() {
    this._workspaceService.findByID(this.taskGroup.work_space).subscribe(res => {
      console.log('this is my workspace ', res);
      this.workspace = res;
      this.user_roles = res.user_role;
    })

  }

  /**
   * GETS LOGGED IN USER
   */
  getLoggedInUser() {
    this._userService.getLoggedInUser().subscribe(res => {
      this.currentUser = res;
      this.changeDetectorRef.markForCheck();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });

  }
  /**
   * GENERATES INFOFORM
  */
  private initInfoForm() {
    this.infoForm = this.fb.group({
      status: [''],
      priority: [''],
      due_date: [''],
      start_date: [''],
      assigned_to: [{ value: '', disabled: this.currentUser && this.currentUser._id == this.task.assigned_to }],
      description: ['']


    })
    console.log("inside initform", this.task);
    this.infoForm.patchValue(this.task);
  }

  /**
   * FETCHES LIST OF ALL STATUSES
   */
  private fetchTaskDefaultStatuses() {
    this.statusList = this._tasksService.getTaskStatus();
    this.priorityList = this._tasksService.getTaskPriorities();

  }

  /**
   * SAVES INFO FORM
   * @param model VALUE OF INFOFORM
   * @param isValid  BOOLEAN TO CHECK IF FORM IS VALID
   */
  public saveInfo(model: Task, isValid: boolean) {
    if (isValid) {
      this._tasksService.save(this.taskGroup.work_space, model, this.task, this.taskGroup).subscribe(task => {
        FlashService.instance.setFlashMessage("Task", "Data saved");
        this._alService.fetchLog();
        this.dialogRef.close(task);
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
    }
  }
}
