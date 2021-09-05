import { Component, OnInit, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TdDialogService } from "@covalent/core";
import { DragulaService } from 'ng2-dragula';
import { Subscription, Subject } from "rxjs";
import { _ } from 'lodash-node';
import { ErrorHandlerService } from '../../../../../shared';
import { menuArr } from '../../../../menu';
import { LayoutService, DialogueService, FlashService } from '../../../../../layout';
import {
  AppletDialogueComponent, FormTaskGroupComponent, WorkspaceService,
  TaskService, WorkSpace, TaskGroupService, TaskGroup, Task, AssignTaskDialogComponent, TaskAddFormComponent
} from '../../../../'

import { DeleteDialogComponent } from '../../../../../shared';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-tasks-home',
  templateUrl: './tasks-home.component.html',
  styleUrls: ['./tasks-home.component.css', '../stylesheets/task-styles.css'],
  providers: [DialogueService]
})
export class TasksHomeComponent implements OnInit, OnDestroy {

  /**
   * Constructor
   * 
   * @param tasksService to fetch and perform tasks related actions
   * @param changeDetector to detect dynamic changes to the data members used inside template
  */
  constructor(private _menuService: LayoutService,
    public dialog: MatDialog,
    private _taskGroupService: TaskGroupService,
    private _taskService: TaskService,
    private route: ActivatedRoute,
    private _workSpaceService: WorkspaceService,
    private _dialogueService: DialogueService,
    private _dragulaService: DragulaService,
    private _dialogService: TdDialogService) {
    _menuService.setMenu(menuArr);

    this.dragEndUsingDragula(_dragulaService);
  }

  public ws: WorkSpace; //CURRENT WORKSPACE
  public taskGroups: TaskGroup[]; // TASKGROUP ARRAY
  public assignedTasks: Task[] = []; //ARRAY OF TASK ASSIGNED
  public totalRecords: number; //TOTAL NUMBER OF RECORDS
  // newTaskGroup: any = { name: '', tasks: [] }; //TEMPLATE FOR NEW TASKgROUP
  public subscriptionDialogue: Subscription;
  public startDrag: number = -1; //INDEX OF DRAGGED ELEMENT 
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;
  private destroy$ = new Subject();

  /**
   * OnInit
  */
  ngOnInit() {
    this.loadWorkSpace();
  }

  /**
   * GET TASK ASSIGNED TO THIS WORKSPACE
   */
  getMyAssignedTasks() {
    //only load assigned tasks for personal workspace
    if (this.ws.space_type == 'Personal')
      this._taskService.findMyAssignedTasks(this.ws._id).subscribe(res => {
        this.assignedTasks = res;
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * SETS BREADCRUMBS
   */

  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { title: 'Tasks' }
    ])
  }

  /**
   * Load the current workSpace
  */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        this.setRecord(wsId);
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * Set WorkSpace Record
  */
  setRecord(id: string): void {

    this._workSpaceService.findByID(id).
      subscribe(
      ws => {
        this.ws = ws;
        this.subScribeAppletDialogue();
        this.setMenu(ws._id);
        // Get all lists now 
        this.getTaskGroupsAgainstWorkSpace();
        this.getMyAssignedTasks();
        this.setBreadCrumbs();
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })
  }

  /**
  * Reload work space need on menu close
  */
  private reloadWorkSpace() {
    //get workspace from database
    this._workSpaceService.findByID(this.ws._id).subscribe((ws) => {
      this.ws = ws;
      this.setMenu(this.ws._id);

    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }


  /**
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('Tasks home subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(res => {
        const data = {
          workSpace: this.ws
        }

        // console.log('this is subscription ',this.subscriptionDialogue);

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        });
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
    }
  }

  /**
   * DELETES TASKS
   * @param task TASK TO BE DELETED
   */
  removeTask(task: Task) {
    let tg: TaskGroup = this.taskGroups.find(element => {
      return element._id === task.task_group_id
    });

    if (tg) {
      tg.tasks.splice(tg.tasks.findIndex(element => {
        return element._id == task._id
      }), 1);
    }
  }

  /**
    * Get All the Task Group against workSpace
  */
  getTaskGroupsAgainstWorkSpace() {

    let queryString = {};
    this._taskGroupService.index_paged(queryString, this.ws).subscribe(
      response => {

        this.taskGroups = response['taskGroups'];
        this.totalRecords = response["totalCount"];
      },
      error => {
        console.log(error);
        FlashService.instance.setFlashMessage("", "Something went wrong");
      }) // end of subscribe
  }

  /**
   * Set Menu from workSpace
   * @param wsId workspace id
  */
  private setMenu(wsId: string) {
    menuArr['sub_module'] = this.ws.name;
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
   * Add new task group
  */
  addTaskGroup() {
    const data = {
      action: 'create',
      workSpace: this.ws,
    };
    this.createDialog(FormTaskGroupComponent, data).afterClosed().subscribe(res => {
      this.getTaskGroupsAgainstWorkSpace();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }

  /**
   * ADDS A TASK TO A TASKGROUP
   * @param taskGroup THE TASKGROUP IN WHICH WE WANT TO ADD TASK
   */
  addTask(taskGroup: TaskGroup) {
    const data = {
      type: 'task',
      object: { name: "", _id: "", assigned_to: "", status: "", description: "" },
      parent: taskGroup
    }

    this.createDialog(TaskAddFormComponent, data).afterClosed().subscribe(result => {
      if (result) {
        console.log("my result ", result);
        this.getTaskGroupsAgainstWorkSpace();

      }
    })

  }

  /**
   * Edit task group name
  */
  editTaskGroupName(taskGroup: TaskGroup, index: number) {
    const data = {
      taskGroup: taskGroup,
      action: 'update',
      workSpace: this.ws,
    };
    this.createDialog(FormTaskGroupComponent, data).afterClosed().subscribe(res => {
      this.reloadWorkSpace();
      this._taskGroupService.findByID(taskGroup._id, this.ws).subscribe(taskGroup => {
        this.taskGroups[index] = taskGroup;
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }

  /**
   * delete task group after confirmation
  */
  deleteTaskGroup(taskGroup: TaskGroup) {

    const data = {
      type: "TaskGroup",
      object: taskGroup
    }
    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._taskGroupService.delete(taskGroup._id, this.ws).subscribe(res => {
          this.getTaskGroupsAgainstWorkSpace();
        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        })

      }
    })
  }



  /**
    * Task Group DRAG STARTED
  */
  dragStart(index: number, $event) {
    console.log('Inside tasks home drag start')

    this.startDrag = index;
    $event.dataTransfer.effectAllowed = 'move';
    $event.dataTransfer.setData('text/plain', '');
  }

  /**
   * Task GroupM DRAG ENTERED
  */
  dragEnter(index: number, $event) {

    if (this.startDrag != -1 && index != this.startDrag) {
      console.log('Inside tasks home drag enter');
      this.taskGroups.splice(index, 0, this.taskGroups.splice(this.startDrag, 1)[0]);
      this.startDrag = index;
    }
  }

  /**
    * Task Group DRAG Ended
  */
  dragEnd(index: number, $event) {
    console.log('Inside tasks home drag End: ' + index);
    this.startDrag = -1;

    let data = { 'taskGroups': {} };
    _.forEach(this.taskGroups, function (model, key) {
      data['taskGroups'][model._id] = key;
    });

    this._taskGroupService.updateOrder(data, this.ws).subscribe(res => {
      this.getTaskGroupsAgainstWorkSpace();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }

  /**
   * Emitter collection fro child component
  */
  public reloadTaskGroupTasks(collection: any) {
    let groupIndex = _.findIndex(this.taskGroups, { '_id': collection.taskGroup._id });
    this.taskGroups[groupIndex].tasks = collection.response.tasks;
  }


  /**
   *  Drag Using Draggula
  */
  private dragEndUsingDragula(_dragulaService) {
    console.log("Drag end using dragula");
    let that = this;
    _dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      console.log(value.slice(1));
      console.log(value);
      //preparation of data element for dragging
      let data = { 'tasks': {} };
      console.log("=======================", data);
      const [bagName, element, newGroup, oldGroup] = value;
      let index = this.getElementIndex(element);
      console.log("element", index, newGroup.dataset);

      //tgId: Task Group Id 
      let tgId: string = newGroup.dataset.id;

      //Find Current Task Group Object to verify invalid task Group from database
      that._taskGroupService.findByPk(tgId, this.ws._id).subscribe(taskGroup => {
        // console.log("checking tgID", tgId);
        var taskComponents = document.querySelectorAll(`mat-card-content.group_${tgId}>app-task-group-task`);
        console.log("checking lodash", taskComponents);
        //preparing task group tasks new order
        _.forEach(taskComponents, function (taskObj, key) {
          // console.log("inside for each dragula ", taskObj);
          data['tasks'][taskObj.dataset.id] = key;
        });


        // if same drag inside same group and Task Group _id  = newGroup.dataset.id
        if (oldGroup.dataset.id == newGroup.dataset.id) {
          that._taskService.updateOrder(this.ws._id, data, taskGroup).subscribe(response => {

          }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
        }
        // drag on different group , first update the group and then call drag
        else {
          // Task _id = element.dataset.id and Task Group _id  = newGroup.dataset.id
          let model = <Task>{ task_group_id: newGroup.dataset.id }
          that._taskService.update(this.ws._id, element.dataset.id, model, taskGroup).subscribe(response => {
            // this.taskGroups.find(element => {
            //   return element._id == taskGroup._id
            // }).tasks.find(tElement => {
            //   return tElement._id == element.dataset.id;
            // }).task_group_id = taskGroup._id; 

            this.getTaskGroupsAgainstWorkSpace();


            that._taskService.updateOrder(this.ws._id, data, taskGroup).subscribe(response => {

            }, error => {
              FlashService.instance.setFlashMessage("", "Something went wrong");
            });
          }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
        }
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })

    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }


  /**
   * RETURNS INDEX OF ELEMENT IN PARENT
   * @param e1 ELEMENT WHOSE INDEX IS TO BE SEARCHED
   */
  private getElementIndex(e1: any) {
    return [].slice.call(e1.parentElement.children).indexOf(e1);
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
  ngOnDestroy(): void {
    // this._dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue) {
      // console.log(this.subscriptionDialogue);
      this.subscriptionDialogue.unsubscribe();
      this.destroy$.next();
    }

  }

}
