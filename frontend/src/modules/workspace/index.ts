/**
 * Note:
 *  If Services are being used in components and you are importing the services via barrel (index.ts),
 * Services should be exported in barrel first. Otherwise it will create some kind of "circular dependency"
 * whish is defficult to debug.
 * 
 */


// Export Services

export * from './services/workspace.service';
export * from './services/applet.service';
export * from './services/list.service';
export * from './services/list-item.service';
export * from './services/task-group.service';
export * from './services/task.service';
export * from './services/activity.log.service';
export * from './services/approval.service';
export * from './services/eod.service';
export * from './services/manage-GroupSettings.service';

// Export View Models

export * from './view-models/work-space';
export * from './view-models/applet';
export * from './view-models/list';
export * from './view-models/list-item';
export * from './view-models/comment';
export * from './view-models/task-group';
export * from './view-models/task';
export * from './view-models/activity-log';
export * from './view-models/approval';
export * from './view-models/attachment';
export * from './view-models/eod-report'

// Export Directives

export * from './directives/focus.directive'

// Export Components

/**
 * USER DASHBOARD COMPONENTS
 */
export * from './components/manage.group-spaces/manage.group-spaces.component';;
export * from './components/form.group-space/form.group-space.component';

/**
* WORKSPACE DASHBOARD COMPONENTS
*/
export * from './components/workspace/workspace.component';
export * from './components/applet-dialogue/applet-dialogue.component';


/**
 * LIST RELATED COMPONENTS
 */
export * from './components/applets/list/list/list.component';
export * from './components/applets/list/list-item/list.item.component';
export * from './components/applets/list/form-list-dialogue/form-list-dialogue.component';
export * from './components/applets/list/copyListDialogue/copyListDialogue.component';
export * from './components/applets/list/shareListDialog/shareListDialog.component';

/**
 * TASK RELATED COMPONENTS
 */
export * from './components/applets/tasks/tasks-home/tasks-home.component';
export * from './components/applets/tasks/task-group-task/task.group.task.component';
export * from './components/applets/tasks//task-add-form/task-add-form.component';
export * from './components/applets/tasks/form-task-group/form-task-group.component';
export * from './components/applets/tasks/task-view/task-view.component';
export * from './components/applets/tasks/task-view-activity/task-view-activity.component';
export * from './components/applets/tasks/task-view-comments/task-view-comments.component';
export * from './components/applets/tasks/task-view-info/task-view-info.component';
export * from './components/applets/tasks/form-task-comment/form-task-comment.component';
export * from './components/applets/tasks/task-view-attachments/task-view-attachments.component';
export * from './components/applets/tasks/assign-task-dialog/assign-task-dialog.component';
export * from './components/applets/tasks/task-edit-info/task-edit-info.component'

/**
 * APPROVAL RELATED COMPONENTS
 */
export * from './components/applets/approvals/approval/approval.component';
export * from './components/applets/approvals/approval-view/approval-view.component';
export * from './components/applets/approvals/approvals-home/approvals-home.component';
export * from './components/applets/approvals/form-add-approval/form-add-approval.component';
export * from './components/applets/approvals/form-forward-approval/form-forward-approval.component';
export * from './components/applets/approvals/approval-view-comments/approval-view-comments.component';
export * from './components/applets/approvals/form-approval-comment/form-approval-comment.component';
export * from './components/applets/approvals/approval-view-activity/approval-view-activity.component';
export * from './components/applets/approvals/approval-view-attachments/approval-view-attachments.component';

//EOD RELATED COMPONENTS
export * from './components/applets/eod/eod-reports-home/eod-reports-home.component';
export * from './components/applets/eod/form-add-eod/form-add-eod.component';
export * from './components/applets/eod/view-eod-report/view-eod-report.component';
export * from './components/applets/eod/eod-reports/eod-reports.component';


//WORKSPACE SETTINGS COMPONENTS
export * from './components/manage-GroupSettings/manage-GroupSettings.component';
export * from './components/form-GroupSettings/form-GroupSettings.component';


// Export Routes
export * from './workspace-routing.module';

