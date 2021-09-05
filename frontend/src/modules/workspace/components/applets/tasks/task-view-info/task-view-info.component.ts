import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TaskService, Task, TaskGroup } from '../../../../'
import { UserService, User } from '../../../../../settings';
import { ErrorHandlerService } from '../../../../../shared';

@Component({
  selector: 'app-task-view-info',
  templateUrl: './task-view-info.component.html',
  styleUrls: ['./task-view-info.component.css'],
  providers: [UserService],
})
export class TaskViewInfoComponent implements OnInit, OnChanges {

  constructor(private _tasksService: TaskService,
    private _userService: UserService,
  ) { }

  @Input() task: Task; //CURRENT TASK
  @Input() taskGroup: TaskGroup; //CURRENT TASKGROUP
  assigned_to: User //OBJECT OF USER WHOM TASK IS ASSIGNED

  ngOnInit() {
    if (this.task.assigned_to) {

      this._userService.get(this.task.assigned_to).subscribe(res => {
        this.assigned_to = res;
      })
    }
  }

  ngOnChanges() {
    //GET ASSIGNED TO USER ON CHANGE
    if (this.task.assigned_to) {

      this._userService.get(this.task.assigned_to).subscribe(res => {
        this.assigned_to = res;
      })
    }
  }

}
