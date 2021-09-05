import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { List, WorkSpace, WorkspaceService } from './../../../../';
import { ProfileService } from '../../../../../settings/'

@Component({
  selector: 'app-shareListDialog',
  templateUrl: './shareListDialog.component.html',
  styleUrls: ['./shareListDialog.component.css', '../stylesheets/list-styles.css']
})
export class ShareListDialogComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<ShareListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public shareForm: FormGroup; //CREATES FORMGROUP FOR SHAREFORM
  public list: List; //CONTAINS CURRENT LIST
  public ws: WorkSpace; //CONTAINS CURRENT WORKSPACE
  public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED
  public componentLabels = { shareEmail: 'Email' }; //LABELS OF COMPONENTS IN FORMGROUP


  ngOnInit() {
    this.list = this.data.list;
    this.ws = this.data.ws;
    this.generateFormContorls();
  }

  /**
   * GENERATES FORM CONTROLS FOR SHAREFORM 
   */
  public generateFormContorls() {
    this.shareForm = this.fb.group({
      shareEmail: ['', Validators.email]
    });
  }

  /**
   * CLOSES CURRENT DIALOG
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * PERFORMS SHARING OF LIST 
   * @param model VALUES OF SHAREFORM
   * @param isValid  BOOLEAN TO CHECK IF FORM IS VALID
   */
  share(model: List, isValid: Boolean) {
    this.submitted = true;
    console.log("this is inside share", model);
    if (isValid) {
      this.dialogRef.close({ list: this.list, model: model, ws: this.ws });

    }
  }
}
