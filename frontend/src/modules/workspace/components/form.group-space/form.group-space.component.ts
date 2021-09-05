import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { WorkSpace, WorkspaceService } from './../../';
import { FlashService } from './../../../layout';

@Component({
  selector: 'app-form.group-space',
  templateUrl: './form.group-space.component.html',
  styleUrls: ['./form.group-space.component.css', '../../stylesheets/modal-styles.css'],
  providers: [WorkspaceService],
})
export class FormGroupSpaceComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FormGroupSpaceComponent>,
    private fb: FormBuilder,
    private _workSpaceService: WorkspaceService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public workspaceForm: FormGroup; //FORMGROUP FOR WORKSPACE
  public ws: WorkSpace; //CURRENT WORKSPACE
  public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED
  public componentLabels = { name: 'Title', description: 'Description' } //LABELS FOR COMPONENTS OF WORKSPACEFORM


  /**
   * Component init
   * all the operations like form controls and data will be populated here
   */
  public ngOnInit() {
    this.generateFormContorls();
    console.log(this.data);
    //lead update
    if (this.data.action == "update") {
      this.ws = this.data.workSpace;
      this.workspaceForm.patchValue(this.ws);
    }

  }

  /**
   * GENERATES FORM ELEMENTS
   */
  public generateFormContorls() {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }




  /**
   * Submit form
   * @param model 
   * @param isValid 
   */
  public save(model: WorkSpace, isValid: boolean) {
    this.submitted = true;
    if (isValid) {
      this._workSpaceService.save(model, this.ws).subscribe(resp => {
        this.dialogRef.close(true);
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      })
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