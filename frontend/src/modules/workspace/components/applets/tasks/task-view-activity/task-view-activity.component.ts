import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivityLogService,WorkSpace } from '../../../../'
import { Subscription } from "rxjs";
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-task-view-activity',
  templateUrl: './task-view-activity.component.html',
  styleUrls: ['./task-view-activity.component.css']

})
export class TaskViewActivityComponent implements OnInit, OnDestroy {

  constructor(public _alService: ActivityLogService) { }

  public activityLog: any[];
  public activityLogSentences: string[] = [];
  public result: any;
  public alSubscription: Subscription;
  @Input() taskId: string;
  @Input() ws:WorkSpace;


  ngOnInit() {
    // console.log("this is my ws",this.ws);
    this.fetchActivityLog();
    this.alSubscription = this._alService.getUpdatedLog$.subscribe(res => {
      console.log('Inside log subscribe method');
      this.fetchActivityLog();
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   *GETTER FOR ACTIVITY LOG
   */
  fetchActivityLog() {
    this._alService.getLogForTask(this.ws._id,this.taskId).subscribe(response => {
      this.activityLog = response;
      this.activityLogSentences = [];
      //generate log sentences to display
      response.forEach((element, index) => {
        this.activityLogSentences[index] = this.generateLogSentence(element);

      });
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * GENERATES SENTENCE THAT IS ADDED TO ACTIVITY LOG
   * @param log 
   */
  generateLogSentence(log: any): string {

    if (log.action === 'add') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "ed new " + log.data_affected;
      }

      else if (log.data_affected === 'start date' || log.data_affected === 'due date') {
        // TODO: figure out how to use date pipe inside a function or its alternate
        return log.action_by.name + " " + log.action + "ed " + log.data_affected + " '" + log.newValue + "'";
      }

      else if (log.data_affected === 'assigned to') {
        return log.action_by.name + " assigned this task to '" + log.new_value + "'";
      }

      else {
        return log.action_by.name + " " + log.action + "ed " + log.data_affected + " '" + log.new_value + "'";
      }
    }

    else if (log.action === 'update') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected;
      }

      else if (log.data_affected === 'start date' || log.data_affected === 'due date') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected + " from '" + log.previousValue + "' to '" + log.newValue + "'";

      }

      else if (log.data_affected === 'assigned to') {
        return log.action_by.name + " changed assigned to from  '" + log.previous_value + "' to '" + log.new_value + "'"
      }

      else {
        return log.action_by.name + " " + log.action + "d " + log.data_affected + " from '" + log.previous_value + "' to '" + log.new_value + "'";
      }
    }

    else if (log.action === 'delete') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected;
      }

      else if (log.data_affected === 'assigned to') {
        return log.action_by.name + " unassigned this task from '" + log.previous_value + "'";
      }

      else {
        return log.action_by.name + " " + log.action + "d " + log.data_affected + ": '" + log.previous_value + "'";
      }
    }

  }


  /**
* onDestroy
*/
  ngOnDestroy(): void {
    // this.dialogueService.setDialogEmitterAvailable();
    if (this.alSubscription) {
      this.alSubscription.unsubscribe();
    }
  }


}