import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TaskGroup, WorkSpace, TaskGroupService } from './../../../../';
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-form-task-group',
  templateUrl: './form-task-group.component.html',
  styleUrls: ['./form-task-group.component.css','../stylesheets/task-styles.css']
})
export class FormTaskGroupComponent implements OnInit {

  public taskGroup: TaskGroup; public ws: WorkSpace
  public taskGroupForm: FormGroup;
  public submitted: boolean;
  public componentLabels = { name: 'Name', description: 'Description' };
  public componentTitle='New Task Group';


  constructor(private dialogRef: MatDialogRef<FormTaskGroupComponent>,
    private fb: FormBuilder,
    private _taskGroupService: TaskGroupService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  /**
    * Component init
    * all the operations like form controls and data will be populated here
  */
  public ngOnInit() {
    this.generateFormContorls();

    console.log(this.data);
    //pull the workspace
    this.ws = this.data.workSpace;

    //list edit mode
    if (this.data.action == "update") {
      this.componentTitle="Edit Task Group"
      this.taskGroup = this.data.taskGroup;
      this.taskGroupForm.patchValue(this.taskGroup);
    }

  }

  /**
   * GENERATES FORM ELEMENTS
  */
  public generateFormContorls() {
    this.taskGroupForm = this.fb.group({
      name: ['', Validators.required]
    });
  }


  /**
   * Submit form
  */
  /**
  * Submit form
  * @param model 
  * @param isValid 
  */
  public save(model: TaskGroup, isValid: boolean) {
    this.submitted = true;
    console.log("this is inside save", model);

    if (isValid) {
      this._taskGroupService.save(model, this.taskGroup, this.ws).subscribe(resp => {
        this.dialogRef.close(true);
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
    }
  }

  /**
   * CLOSE DIALOG
  */
  public close() {
    this.dialogRef.close();
  }

  /**
   * SHOW SNACKBAR WITH PROVIDED MESSAGE
  */
  private showSnackBar(message: string): void {
    if (!message || message === '') {
      message = 'Something went wrong';
    }
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
