import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
// import { MatDialog } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TdDialogService } from "@covalent/core";
import { DragulaService } from 'ng2-dragula';
import { _ } from 'lodash-node';
import { TaskGroup, Task, TaskService, WorkspaceService, WorkSpace } from '../../../../'
import { FlashService } from './../../../../../layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-task-add-form',
    templateUrl: './task-add-form.component.html',
    styleUrls: ['./task-add-form.component.css', '../stylesheets/task-styles.css']

})
export class TaskAddFormComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<TaskAddFormComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private _taskService: TaskService,
        private _dragulaService: DragulaService,
        private _dialogService: TdDialogService,
        private _workspaceService: WorkspaceService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    taskGroup: TaskGroup; //HAS CURRENT TASKGROUP
    isDisabled: boolean;

    public task: Task; //HOLDS CURRENT TASK
    public componentLabels = { name: 'Task', description: 'Description', assigned_to: 'Assign to User:', status: 'Status' } //LABELS FOR COMPONENTS OF TASKGROUP
    public taskForm: FormGroup; //FORMGROUP FOR ADDING TASK
    public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED
    public hiddenAddTaskField: boolean = true; //BOOLEAN TO CHECK IF ADD TASK FIELD SHOULD BE HIDDEN
    public statusList: any[] = []; //LIST OF ALL STATUSES
    public workspace: WorkSpace;
    public user_roles; //LIST OF ALL USERS WITH ROLES IN WORKSPACE
    public componentTitle = "Add task";
    @Output() stateChange = new EventEmitter<any>();

    /**
     * 
     * @param dialog Constructor
     * @param changeDetector To detect changes made dynamically
     * @param _dialogService teradata dialog box
    */

    /**
     * OnInit
    */
    ngOnInit() {
        console.log("this is data ", this.data);
        this.taskGroup = this.data.parent;
        this.task = this.data.object;
        this.fetchTaskDefaultStatuses();
        this.generateFormContorls();
        if (this.data.action == "update") {
            this.componentTitle = "Edit task";
            this.task = this.data.object;
            this.taskForm.patchValue(this.task);

            //doing this since we have populated assinged_to but we only need id in patchvalue
            this.taskForm.patchValue({ assigned_to: this.task.assigned_to._id })
        }

        this.getWorkspace();
    }

    /**
     * GETS CURRENT WORKSPACE
     */
    getWorkspace() {
        this._workspaceService.findByID(this.taskGroup.work_space).subscribe(res => {
            console.log('this is my workspace ', res);
            this.workspace = res;
            this.user_roles = res.user_role;
            console.log("these are roles ", this.user_roles);
        })

    }

    /**
     * GENERATES FORM ELEMENTS
    */
    public generateFormContorls() {
        this.taskForm = this.fb.group({
            assigned_to: [''],
            name: ['', Validators.required],
            status: [''],
            description: [''],

        });

    }


    /**
 * FETCHES LIST OF ALL STATUSES
 */
    private fetchTaskDefaultStatuses() {
        this.statusList = this._taskService.getTaskStatus();

    }

    /**
    * Above method will get the task again 
    * Get All the Task  against Task Group
    */
    private getTaskAgainstTaskGroup() {

        let queryString = {};
        this._taskService.index_paged(this.taskGroup.work_space, queryString, this.taskGroup).subscribe(
            response => {
                this.stateChange.emit({ taskGroup: this.taskGroup, response: response });
                this.taskForm.reset();
            },
            error => {
                FlashService.instance.setFlashMessage("", "Something went wrong");
            }
        ) // end of subscribe
    }


    /**
     * Add new task to the task group
    */
    public save(model: Task, isValid: boolean) {
        this.submitted = true;
        console.log("this is inside save", model);

        if (isValid) {
            //PCM: Low shift following weight logic to backend.
            model.weight = this.taskGroup.tasks.length;
            this._taskService.create(this.taskGroup.work_space, model, this.taskGroup).subscribe(resp => {
                this.task = resp;

                this.dialogRef.close(this.taskGroup._id);

                this.getTaskAgainstTaskGroup();
            }, error => {
                this.taskForm.reset();
                FlashService.instance.setFlashMessage("", "Something went wrong");
            })
        }
    }

    /**
     * Toggle add task field's visibility
    */
    toggle() {
        this.hiddenAddTaskField = !this.hiddenAddTaskField;
        this.taskForm.reset();
    }

}