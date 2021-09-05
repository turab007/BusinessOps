import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivityLogService,WorkSpace } from '../../../../'
import { Subscription } from "rxjs";
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-approval-view-activity',
  templateUrl: './approval-view-activity.component.html',
  styleUrls: ['./approval-view-activity.component.css']
})
export class ApprovalViewActivityComponent implements OnInit, OnDestroy {

  constructor(public _alService: ActivityLogService) { }

  public activityLog: any[];
  public activityLogSentences: string[] = [];
  public result: any;
  public alSubscription: Subscription;
  @Input() approvalId: string;
  @Input() ws:WorkSpace;

  ngOnInit() {
    this.fetchActivityLog();
    this.alSubscription = this._alService.getUpdatedLog$.subscribe(res => {
      this.fetchActivityLog();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  /**
   * GET ACTIVITY LOG
   */
  fetchActivityLog() {
    this._alService.getLogForApproval(this.ws._id,this.approvalId).subscribe(response => {
      this.activityLog = response;
      this.activityLogSentences = [];
      //generate log sentences to display
      response.forEach((element, index) => {
        this.activityLogSentences[index] = this.generateLogSentence(element);

      });
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  /**
   * GENERATES SENTENCE FOR ACTIVITY LOG
   * @param log 
   */

  generateLogSentence(log: any): string {

    if (log.action === 'add') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "ed new " + log.data_affected;
      }

      else if (log.data_affected === 'due date') {
        return log.action_by.name + " " + log.action + "ed " + log.data_affected + " '" + log.newValue + "'";
      }
      else {
        return log.action_by.name + " " + log.action + "ed " + log.data_affected + " '" + log.new_value + "'";
      }
    }

    else if (log.action === 'update') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected;
      }

      else if (log.data_affected === 'due date') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected + " from '" + log.previousValue + "' to '" + log.newValue + "'";

      }
      else {
        return log.action_by.name + " " + log.action + "d " + log.data_affected + " from '" + log.previous_value + "' to '" + log.new_value + "'";
      }
    }

    else if (log.action === 'delete') {

      if (log.data_affected === 'comment' || log.data_affected === 'description') {
        return log.action_by.name + " " + log.action + "d " + log.data_affected;
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
    if (this.alSubscription) {
      this.alSubscription.unsubscribe();
    }
  }


}
