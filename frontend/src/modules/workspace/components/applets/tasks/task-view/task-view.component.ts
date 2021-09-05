import { Component, OnInit, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { _ } from 'lodash-node';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { menuArr } from '../../../../menu';
import {
  AppletDialogueComponent, WorkspaceService, TaskService,
  TaskGroupService, WorkSpace, Task, TaskGroup, TaskEditInfoComponent,
  TaskViewActivityComponent, ActivityLogService
} from '../../../../'
import { LayoutService, DialogueService, FlashService } from '../../../../../layout';
import { UserService, User } from '../../../../../settings';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
  providers: [DialogueService,UserService],


})
export class TaskViewComponent implements OnInit, OnDestroy {

  constructor(public _menuService: LayoutService,
    public dialog: MatDialog,
    public _alService: ActivityLogService,
    private _userService: UserService,
    private _tasksService: TaskService,
    private _taskGroupService: TaskGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private _workSpaceService: WorkspaceService,
    private _dialogueService: DialogueService,
    private fb: FormBuilder) {
    // _menuService.setMenu(menuArr);
  }

  public ws: WorkSpace; //CURRENT WORKSPACE
  private assigned_to:User;
  public task: Task; //CURRENT TASK
  public taskGroup: TaskGroup; //CURRENT TASKGROUP
  public subscriptionDialogue: Subscription;
  public descForm: FormGroup; //FORMGOUP FOR DESCRIPTION
  public titleForm: FormGroup; //FORMGROUP FOR TITLE
  public editDesc = false; //BOOLEAN TO CHECK IF DESCRIPTION IS EDITABLE
  public editTitle = false; //BOOLEAN TO CHECK IF TITLE IS EDITABLE
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;


  /**
   * OnInit
   */
  ngOnInit() {
    console.log("ok, this is ws", this.ws);
    this.loadWorkSpace();
    



  }

  /**
   * SETS BREADCRUMBS
   */
  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { url: '/workspace/' + this.ws._id + '/tasks', title: 'Tasks' },
      { title: 'Task View' }
    ])
  }

  /**
 * Fetch task from service
*/
  private fetchTask() {
    this.route.params.subscribe(
      params => {
        let tsId = params['ts_id'];
        let groupId = params['g_id'];
        let ws_id = params['ws_id'];

        this.loadTaskGroup(groupId, ws_id);

        this._tasksService.findByIDAndGroup(ws_id, tsId, groupId).subscribe(task => {
          // this.task = this._tasksService.getTask(tsId);
          this.task = task;
          console.log(this.task);
          this.task._id = tsId;
          this.initForms();
          this.getAssignedUser();
        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * INITIATES ALL FORMGROUPS
  */
  public initForms() {
    this.descForm = this.fb.group({
      description: [this.task.description, Validators.required]
    });

    this.titleForm = this.fb.group({
      name: [this.task.name, Validators.required]
    });
  }

  /**
   * Load task group
  */
  private loadTaskGroup(groupId, work_space: string) {
    this._taskGroupService.findByPk(groupId, work_space).subscribe(taskGroup => {
      this.taskGroup = taskGroup;
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })
  }

  /**
   * Load the current workSpace
  */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        //get workspace from database
        this._workSpaceService.findByID(wsId).subscribe((result) => {
          this.ws = result;
          this.fetchTask();

          this.setMenu(wsId);
          //subcribe the applet dialogue
          this.subScribeAppletDialogue();
          this.setBreadCrumbs();

        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }


  /**
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      console.log('Tasks home subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(res => {
        const data = {
          workSpace: this.ws
        }

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        });
    }
  }


  /**
  * Reload work space need on menu close
  */
  private reloadWorkSpace() {
    //get workspace from database
    this._workSpaceService.findByID(this.ws._id).subscribe((ws) => {
      this.ws = ws;
      this.setMenu(this.ws._id);

    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }


  /**
   * Set Menu from workSpace
   * @param wsId workspace id
   */
  private setMenu(wsId: string) {

    let menu = menuArr;
    let applets = _.map(this.ws['applets'], "name");

    menu.applet_links = _.filter(menu.all_applets, (link) => {
      if (_.includes(applets, link.applet)) {
        return link;
      }
    })

    //set menu 
    this._menuService.setMenu(menu, ":id", wsId);

  }


  /**
   * GET USER WHOM TASK IS ASSIGNED TO
   */
  getAssignedUser() {
    console.log("this is my task ",this.task)
    if (this.task.assigned_to) {
      console.log("if working ");
      this._userService.get(this.task.assigned_to).subscribe(res => {
        this.assigned_to = res;
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        })

    }

  }


  /**
   * OPENS DIALOGUE TO EDIT TASK
   * @param model 
   * @param isValid 
   */
  public editTask() {
    let data = {
      type: 'task',
      object: this.task,
      parent: this.taskGroup
    }

    this.createDialog(TaskEditInfoComponent, data).afterClosed().subscribe(result => {
      if (result) {

        // this.task=result;
        this._tasksService.findByID(this.taskGroup.work_space, this.task._id, this.taskGroup).subscribe(res => {
          this.task = res;
          console.log("task updated ", this.task);
          this._alService.fetchLog();
        })
      }
    })
    // console.log('desc model: ', model);
    // if (isValid) {

    //   this._tasksService.save(this.ws._id, model, this.task, this.taskGroup).subscribe(resp => {
    //     this.toggleEditDesc();
    //     this.task.description = model.description;
    //     
    //     FlashService.instance.setFlashMessage("OK", "Data saved");

    //   }, error => {
    //     FlashService.instance.setFlashMessage("OK", "Something went wrong");
    //     this.toggleEditDesc();
    //   })

    // }
  }

  //   /**
  //  * UPDATES TITLE
  //  * @param model 
  //  * @param isValid 
  //  */
  //   public updateTitle(model: Task, isValid: boolean) {
  //     console.log('title model: ', model);
  //     if (isValid) {

  //       this._tasksService.save(this.ws._id, model, this.task, this.taskGroup).subscribe(resp => {
  //         this.toggleEditTitle();
  //         this.task.name = model.name;
  //         this._alService.fetchLog();
  //         FlashService.instance.setFlashMessage("OK", "Data saved");

  //       }, error => {
  //         FlashService.instance.setFlashMessage("OK", "Something went wrong");
  //         this.toggleEditTitle();
  //       })

  //     }
  //   }

  /**
   * Hide and show description box 
  */
  public toggleEditDesc() {
    this.editDesc = !this.editDesc;
  }

  /**
   * Hide and show title box 
  */
  public toggleEditTitle() {
    this.editTitle = !this.editTitle;
  }

  /**
   * Reload and Refresh the component via emiiter
  */
  public refreshContent() {
    this.fetchTask();
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
   * onDestroy
   */
  public ngOnDestroy(): void {
    if (this.subscriptionDialogue) {
      this.subscriptionDialogue.unsubscribe();
    }
  }

}
