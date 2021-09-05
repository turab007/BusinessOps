import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TdDialogService } from "@covalent/core";
import { DragulaService } from 'ng2-dragula';
import { _ } from 'lodash-node';

import { FlashService } from './../../../../../layout';
import { TaskGroup, Task, TaskService, TasksHomeComponent } from '../../../../'
import { DeleteDialogComponent } from '../../../../../shared';
import { AssignTaskDialogComponent, TaskAddFormComponent } from '../../../../';

@Component({
  selector: 'app-task-group-task',
  templateUrl: './task.group.task.component.html',
  styleUrls: ['./task.group.task.component.css', '../stylesheets/task-styles.css']

})
export class TaskGroupTaskComponent implements OnInit {
  /**
   * 
   * @param dialog Constructor
   * @param changeDetector To detect changes made dynamically
   * @param _dialogService teradata dialog box
  */
  constructor(public dialog: MatDialog,
    // private fb: FormBuilder,
    private _taskService: TaskService,
    private _dragulaService: DragulaService,
    private _dialogService: TdDialogService) { }

  @Input() taskGroup: TaskGroup;//HAS CURRENT TASKGROUP
  @Input() task: Task[]; //HAS AN ARRAY OF TASKS OF THE TASKGROUP
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger; //TO CONTROL MATERIAL MENU PROGRAMATICALLY


  @Output() onRemoveTask = new EventEmitter<Task>();

  /**
   * OnInit
  */
  ngOnInit() {

  }

  /**
   * OPENS matMenu
   * @param  
   */
  openMenu($event: any) {
    this.trigger.openMenu();
    this.stopPropagation($event);
  }

  /**
   * FUNCTION TO DELETE A TASK
   * @param task  TASK TO BE DELETED
   */
  deleteTask(task: Task, event) {
    event.stopPropagation();

    const data = {
      type: 'task',
      object: task
    }
    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._taskService.delete(this.taskGroup.work_space, task.task_group_id, task).subscribe(response => {
          FlashService.instance.setFlashMessage("OK", "Task Removed");
          this.onRemoveTask.emit(task);
        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");
        })

      }
    })
  }

  assignTask(task: Task, event) {
    event.stopPropagation();
    console.log("my objectt ", task);
    const data = {
      type: "task",
      object: task,
      ws: this.taskGroup.work_space,
      parent: this.taskGroup
    }

    this.createDialog(AssignTaskDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {

      }
    })
  }

  /**
   * OPENS DIALOGUE TO EDIT A TASK
   */
  editTask(task: Task, event) {
    event.stopPropagation();

    let data= {
      type: TasksHomeComponent,
      object: task,
      parent:this.taskGroup,
      action: "update"
    }

    this.createDialog(TaskAddFormComponent,data).afterClosed().subscribe(result=>
    {
      if(result)
      {
        
      }
    })

  }


  /*
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
   * to stop triggering of parent's event handler
   * @param  event EVENT TO BE STOPPED
  */
  private stopPropagation($event) {
    if ($event.stopPropagation) {
      // FOR IE 8+
      $event.stopPropagation();
    } else {
      // FOR IE < 8
      $event.returnValue = false;
    }
  }
}
