import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";

import { Comment } from './../../../../'

@Component({
  selector: 'app-form-approval-comment',
  templateUrl: './form-approval-comment.component.html',
  styleUrls: ['./form-approval-comment.component.css','../stylesheets/approvals-styles.css']
})
export class FormApprovalCommentComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FormApprovalCommentComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  public comment: Comment; //CURRENT COMMENT
  // public ws: WorkSpace
  public commentForm: FormGroup; //FOMRGROUP FOR COMMENT
  public submitted: boolean; //IF FORM IS SUBMITTED
  public componentLabels = { comment: 'write your comment' } //LABELS FOR FORMGROUP'S COMPONENTS



  /**
    * Component init
    * all the operations like form controls and data will be populated here
  */
  public ngOnInit() {
    this.generateFormContorls();

    console.log(this.data);

    //list edit mode
    if (this.data.action == "update") {
      this.comment = this.data.comment;
      this.commentForm.patchValue(this.comment);
    }

  }

  /**
   * GENERATES FORM ELEMENTS
  */
  public generateFormContorls() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
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
  public save(model: Comment, isValid: boolean) {
    this.submitted = true;
    console.log("this is inside save", model);

    if (isValid) {
      this.dialogRef.close(model);
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
