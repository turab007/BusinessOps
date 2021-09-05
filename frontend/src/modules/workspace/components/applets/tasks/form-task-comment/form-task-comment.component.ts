import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";

import { Comment } from './../../../../'

@Component({
  selector: 'app-form-task-comment',
  templateUrl: './form-task-comment.component.html',
  styleUrls: ['./form-task-comment.component.css','../stylesheets/task-styles.css']
})
export class FormTaskCommentComponent implements OnInit {


  public comment: Comment; //CONTAINS COMMENT IF IN EDIT STATE
  public commentForm: FormGroup; //FORMGROUP FOR TASK COMMENTS
  public submitted: boolean; //BOOLEAN TO CHECK IF FORM IS SUBMITTED
  public componentLabels = { comment: 'write your comment' } //LABELS FOR COMPONENTS IN FORMGROUP


  constructor(private dialogRef: MatDialogRef<FormTaskCommentComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


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
