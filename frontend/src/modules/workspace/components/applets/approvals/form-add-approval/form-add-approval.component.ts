import { Component, OnInit, EventEmitter, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { _ } from 'lodash-node';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";
import { FlashService } from './../../../../../layout';

import { menuArr } from '../../../../menu';
import { LayoutService, DialogueService } from '../../../../../layout';
import { AppletDialogueComponent, Approval, WorkSpace, WorkspaceService, ApprovalService } from '../../../../'
import { UserService, User, ProfileService } from '../../../../../settings';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-form-add-approval',
  templateUrl: './form-add-approval.component.html',
  styleUrls: ['./form-add-approval.component.css', '../stylesheets/approvals-styles.css'],
  providers: [DialogueService, ApprovalService, UserService, ProfileService]
})
export class FormAddApprovalComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _approvalService: ApprovalService,
    private snackBar: MatSnackBar,
    private _userService: UserService,
    public dialogRef: MatDialogRef<FormAddApprovalComponent>,
    private changeDetector: ChangeDetectorRef,
    private _profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  public ws: WorkSpace; //CURRENT WORKSPACE
  public approval: Approval; //CURRENT APPROVAL
  public workspaces_list: WorkSpace[]; // ALL WORKSPACES
  public filtered_data: any; //WORKSPACES AND USERS FILTERED FOR AUTOCOMPLETE
  public fileStore: any[] = []; //CONTAINS ALL ATTACHMENTS BEFORE SAVING
  public users; //ALL USERS
  public userAndWorkspaces: any[]; //USERS AND WORKSPACES BEFORE FILTERING
  public approvalForm: FormGroup; //FORMGROUP FOR APPROVAL
  public componentLabels = { //LABELS FOR COMPONENTS OF APPROVAL FORM
    name: 'Title',
    description: 'Description',
    assign_to_workspace: 'Assign to',
    comment: 'Comment',
    attachment: 'Attachment',
    due_date: 'Due Date',
    assign_to_user: 'Assign to User'
  }




  ngOnInit() {

    this.ws = this.data.workSpace;


    console.log("this is ws ", this.ws)

    this.getWorkSpaces();
    this.generateFormContorls();

  }



  /**
   * GET ALL WORKSPACES AND USERS
   */
  getWorkSpaces() {
    // get ws
    this._profileService.getWorkSpaces().subscribe(res => {
      this.workspaces_list = res;
      // console.log("this is the ugly response ", res);
      this.userAndWorkspaces = this.workspaces_list.map(element => {
        return { _id: element._id, name: element.name, type: 'ws' }
      });

      //get users
      this._userService.getUsers().subscribe(res => {
        this.users = (<any>res).users;

        // combine both
        this.userAndWorkspaces.push.apply(this.userAndWorkspaces, this.users.map(element => {
          return { _id: element._id, name: element.name, type: 'user' }
        }));
        //update UI
        this.changeDetector.markForCheck();
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
      console.log('This is combined array', this.userAndWorkspaces);
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  /**
   * GENERATE FORM CONTROLS FOR APPROVAL FORM
   */
  public generateFormContorls() {
    this.approvalForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      assign_to_workspace: ['', Validators.required],
      assign_to_user: [''],
      comment: [''],
      attachment: [''],
      due_date: ['']
    });

    if (this.data.action == 'update') {
      this.approval = this.data.object;
      this.approvalForm.patchValue(this.approval);
    }
    this.filterWorkspaces();
  }

  /**
   * APPLY FILTERING TO USERS AND WORKSPACES FOR AUTOCOMPLETE
   */
  filterWorkspaces() {
    this.filtered_data = this.approvalForm.get('assign_to_workspace').valueChanges
      .startWith(null)
      .map(val => this.filter(val));

    // console.log('filtered: ', this.filtered_data);
  }

  /**
   * USED BY filterWorkspaces() FOR FILTERING 
   * @param val  VALUE ENTERED BY USER IN AUTOCOMPLETE
   */
  filter(val: string) {
    let type = typeof val;
    console.log("type of", typeof val)
    if (type == 'string') {

      console.log('this is value', val);
      let abc = this.userAndWorkspaces.filter(s =>
        s.name.toLowerCase().indexOf(val.toLowerCase()) === 0);

      console.log("this is abc", abc);
      return abc;
    }
    else if (type != null) {
      return this.userAndWorkspaces;
    }


  }

  /**
   * FUNCTION FOR HAVING DIFFERENT DISPLAY VALUE IN AUTCOMPLETE
   * @param assign 
   */
  displayFn(assign: any): string {
    return assign ? assign.name : assign;
  }


  /**
   * SAVE ATTACHMENT TO LOCAL VARIABLE (FILESTORE) BEFORE BEING SAVED
   * @param target 
   */
  saveAttachmentName(target: any) {
    this.fileStore.push.apply(this.fileStore, target.files);
    this.changeDetector.detectChanges();
  }

  /**
   * DELETE ATTACHMENT FROM LOCAL VARIABLE (FILESTORE) BEFORE BEING SAVED
   * @param i 
   */
  deleteAttachment(i: number) {
    this.fileStore.splice(i, 1);
    this.changeDetector.detectChanges();

  }

  /**
   * SAVE APPROVAL
   */
  save(model: Approval) {
    // model.work_space=model.work_space._id;

    console.log('approval model: ', model,this.data);

    if (this.data.action == "create") {

      if (model.assign_to_workspace) {
        model.assign_to_workspace = model.assign_to_workspace._id;
      }
      else {
        model.assign_to_user = model.assign_to_workspace._id;
        model.assign_to_workspace = null;
      }

      this._approvalService.create(model, this.ws._id).subscribe(res => {
        this.approval = res;
        this.saveAttachment();

        if (res) {
          let message = this.approval.name + ' created successfully';
          this.showSnackBar(message);
          this.dialogRef.close(res);
        }
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
    }
    else
      if (this.data.action == 'update') {

        // console.log("checking values ", this.approval._id, 'ws', this.ws._id)
        if (model.assign_to_workspace.type == 'ws') {
          model.assign_to_workspace = model.assign_to_workspace._id;
        }
        else {
          model.assign_to_user = model.assign_to_workspace._id;
          model.assign_to_workspace = null;
        }
        this._approvalService.update(this.approval._id, model, this.ws._id).subscribe(res => {
          // this.approval = res;
          this.saveAttachment();

          if (res) {
            let message = this.approval.name + ' updated successfully';
            this.showSnackBar(message);
            this.dialogRef.close(res);
          }
        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");

        });
      }
  }

  /**
   * SAVE ATTACHMENTS FOR APPROVAL
   */
  saveAttachment() {

    // Loop over all the attached files
    this.fileStore.forEach(file => {
      let formData: FormData = new FormData();
      formData.append("uploadFile[]", file);

      this._approvalService.addAttachment(this.ws._id, this.approval, formData)
        .subscribe(response => { },
        error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");
        })
    })

  }



  /**
   * SHOW SNACKBAR  
   */
  private showSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 1000,
    }).afterDismissed().subscribe(result => {
      // this.router.navigate(['/workspace/', this.ws._id, 'approvals']);
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

}
