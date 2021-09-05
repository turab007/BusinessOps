import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { List, WorkSpace, ListService } from './../../../../';
// import { ErrorHandlerService } from '../../../../../shared'
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-form-list-dialogue',
  templateUrl: './form-list-dialogue.component.html',
  styleUrls: ['./form-list-dialogue.component.css','../stylesheets/list-styles.css']

})
export class FormListDialogueComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FormListDialogueComponent>,
    private fb: FormBuilder,
    private _listService: ListService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  public listForm: FormGroup; //FORMGROUP TO STORE VALUES OF NEW LIST
  public formTitle: string = "New List"; //HEADING OF LIST FORM
  public list: List;  //CONTAINS LIST IF IN EDIT STATE
  public ws: WorkSpace //CONTAINS CURRENT WORKSPACE
  public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED
  public componentLabels = { name: 'Title', description: 'Description' } //LABELS OF COMPONENTS USED IN FORM
  public defaultVisibiliy = { value: 'Public' }; //SETTING DEFAULT VISIBILITY OF LIST TO PUBLIC


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
      this.list = this.data.list;
      this.listForm.patchValue(this.list);
      this.formTitle = "Edit List";
    }

  }

  /**
   * GENERATES FORM ELEMENTS
  */
  public generateFormContorls() {
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      visibility: ['Public', Validators.required]
    });
  }

  /**
   * Submit form
   * @param model 
   * @param isValid 
   */
  public save(model: List, isValid: boolean) {
    this.submitted = true;
    console.log("this is inside save", model);

    if (isValid) {
      this._listService.save(model, this.list, this.ws).subscribe(resp => {
        this.dialogRef.close(true);
      }, error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
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
