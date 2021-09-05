import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { _ } from 'lodash-node';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { TdDialogService } from "@covalent/core";
import { UserService, User } from '../../../../../settings'

import { FlashService } from 'modules/layout/services/flash.service';
import { menuArr } from '../../../../menu';
import {
  AppletDialogueComponent,
  WorkspaceService,
  ApprovalService,
  WorkSpace,
  Approval,
  FormForwardApprovalComponent,
  FormAddApprovalComponent
} from '../../../../'

import {
  LayoutService,
  DialogueService
} from '../../../../../layout';

@Component({
  selector: 'app-approval-view',
  templateUrl: './approval-view.component.html',
  styleUrls: ['./approval-view.component.css'],
  providers: [DialogueService, UserService]
})
export class ApprovalViewComponent implements OnInit {

  /**
   * Constructor
   * 
   */
  constructor(private _menuService: LayoutService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _approvalService: ApprovalService,
    private route: ActivatedRoute,
    private router: Router,
    private _workSpaceService: WorkspaceService,
    private _dialogueService: DialogueService,
    private _tDialogService: TdDialogService,
    private _userService: UserService) {
    // _menuService.setMenu(menuArr);
  }

  public ws: WorkSpace; //CURRENT WORKSPACE
  public approval: Approval; //CURRENT APPROVAL
  public subscriptionDialogue: Subscription;
  public currentUser: User; //CURRENT USER
  public editDesc = false;  //BOOLEAN TO TELL IF DESCRIPTION IS IN EDITABLE STATE
  public editTitle = false; //BOOLEAN TO TELL IF TITLE IS IN EDITABLE STATE
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;

  // startDrag: number = -1;
  // descForm: FormGroup; //FORMGROUP FOR DESCRIPTION
  // titleForm: FormGroup; //FORMGROUP FOR TITLE

  // today: number = Date.now(); //TODAY'S DATE


  //CONFIGURAION FOR CKEDITOR
  ckEditorConfig: any = {
    uiColor: '#E4E5E4',
    toolbarGroups: [
      {
        name: 'basicstyles',
        groups: ['basicstyles', 'list', 'align'],
        // items:['Bold', 'Italic', 'Strike','-', 'NumberedList', 'BulletedList'] 
      },
      {
        name: 'styles',
        groups: ['styles'],
        // items: ['Styles', 'Format']
      },
    ]
  };

  /**
   * OnInit
   */
  ngOnInit() {
    this.loadWorkSpace();
    this.fetchApproval();
    this._userService.getLoggedInUser().subscribe(res => {
      this.currentUser = res;
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });

  }

  /**
   * SETS BREADCRUMBS
   */
  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { url: '/workspace/' + this.ws._id + '/approvals', title: 'Approvals' },
      { title: 'Approval Request' }
    ])
  }

  /**
   * Fetch approval from service
  */
  private fetchApproval() {
    this.route.params.subscribe(
      params => {
        let apId = params['ap_id'];
        let ws_id = params['ws_id'];

        this._approvalService.findByIDAndWorkSpace(apId, ws_id).subscribe(approval => {
          this.approval = approval;
          // this.approval._id = apId;
          this.initForms();
        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");

        });
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
  }

  /**
   * INITITATES FORMGROUPS
  */
  public initForms() {
    // this.descForm = this.fb.group({
    //   description: [this.approval.description, Validators.required]
    // });

    // this.titleForm = this.fb.group({
    //   name: [this.approval.name, Validators.required]
    // });
  }

  /**
   * Load the current workSpace
  */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        //get workspace from database
        this._workSpaceService.findByID(wsId).subscribe((result) => {
          this.ws = result;

          this.subScribeAppletDialogue();
          this.setMenu(wsId);
          //subcribe the applet dialogue
          this.setBreadCrumbs();

        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");

        });
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
  }


  /**
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('approvals view subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(res => {
        const data = {
          workSpace: this.ws
        }

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        }, error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");

        });
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");

      });
    }
  }


  /**
  * Reload work space need on menu close
  */
  private reloadWorkSpace() {
    //get workspace from database
    this._workSpaceService.findByID(this.ws._id).subscribe((ws) => {
      this.ws = ws;
      this.setMenu(this.ws._id);

    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }


  /**
   * Set Menu from workSpace
   * @param wsId workspace id
   */
  private setMenu(wsId: string) {
    menuArr['sub_module'] = this.ws.name;
    let menu = menuArr;
    let applets = _.map(this.ws['applets'], "name");

    menu.applet_links = _.filter(menu.all_applets, (link) => {
      if (_.includes(applets, link.applet)) {
        return link;
      }
    })

    //set menu 
    this._menuService.setMenu(menu, ":id", wsId);

  }

  /**
   * UPDATES DESCRIPTION OF APPROVAL
   * @param model 
   * @param isValid 
   */
  public updateDesc(model: Approval, isValid: boolean) {
    console.log('desc model: ', model);
    if (isValid) {

      this._approvalService.save(model, this.approval, this.ws._id).subscribe(resp => {
        this.toggleEditDesc();
        this.approval.description = model.description;
      }, error => {
        this.toggleEditDesc();
        FlashService.instance.setFlashMessage("", "Something went wrong");

      })

    }
  }

  /**
 * UPDATE TITLE OF APPROVAL
 * @param model 
 * @param isValid 
 */
  public updateTitle(model: Approval, isValid: boolean) {
    console.log('title model: ', model);
    if (isValid) {

      this._approvalService.save(model, this.approval, this.ws._id).subscribe(resp => {
        this.toggleEditTitle();
        this.approval.name = model.name;
      }, error => {
        this.toggleEditTitle();
        FlashService.instance.setFlashMessage("", "Something went wrong");

      })

    }
  }
/**
 * OPENS DIALOGUE TO EDIT APPROVAL
 */
  editApproval()
  {
    let data={
      type: 'approval',
      action:'update',
      object: this.approval,
      workSpace:this.ws
    }
    this.createDialog(FormAddApprovalComponent,data).afterClosed().subscribe(res=>
    {
      if(res)
      {
        this._approvalService.findByID(this.approval).subscribe(res=>
        {
          this.approval=res;
        })

      }
    })

  }

  /**
   * Hide and show description box 
  */
  public toggleEditDesc() {
    this.editDesc = !this.editDesc;
  }

  /**
   * Hide and show title box 
  */
  public toggleEditTitle() {
    this.editTitle = !this.editTitle;
  }

  /**
   * Reload and Refresh the component via emiiter
  */
  public refreshContent() {
    this.fetchApproval();
  }

  updateStatus(status: string) {
    this._tDialogService.openConfirm({
      message: `Are you sure you want to mark this request as ${status}?`,
      disableClose: false,
      title: 'Confirm', //OPTIONAL, hides if not provided
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        let model: Approval = this.approval;
        model.status = status;
        this._approvalService.update(this.approval._id, model, this.ws._id).subscribe(response => {
          this.approval.status = status;
          FlashService.instance.setFlashMessage("OK", 'Request ' + status);
          this.router.navigate(['workspace', this.ws._id, 'approvals']);
        }, error => {
          FlashService.instance.setFlashMessage("OK", "Something went wrong");
        })
      }
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  // forwardRequest() {
  //   const data = {
  //     approval: this.approval,
  //     // action: 'update'
  //   }

  //   this.createDialog(FormForwardApprovalComponent, data).afterClosed().subscribe((result: Approval) => {
  //     // this.reloadWorkSpace();
  //     // this.dialogRefWorkSpace = null;
  //     if (result) {
  //       // comment.comment = result.comment;
  //       // this._approvalService.updateComment(comment, this.approval).subscribe(response => {
  //       //   FlashService.instance.setFlashMessage("OK", "Comment Updated");

  //       //   // this.reloadApprovalComments();

  //       // }, error => {
  //       //   FlashService.instance.setFlashMessage("OK", "Something went wrong");

  //       // })
  //     }
  //   }, error => {
  //     FlashService.instance.setFlashMessage("", "Something went wrong");

  //   });
  // }


  /**
 * ADD ATTACHMENT TO CURRENT TASK
 */
  public addAttachment(target) {
    console.log('this is target', target);
    if (target) {
      let fileList: FileList = target.files;
      let fileListLength = fileList.length;
      if (fileListLength > 0) {

        // Loop over all the attached files
        for (var i = 0; i < fileListLength; i++) {
          let formData: FormData = new FormData();
          formData.append("uploadFile[]", fileList[i]);


          // this._tasksService.addAttachment(this.task, formData)
          // .subscribe(response => {
          // console.log("this is inside addAttachment function", response);
          // },
          // error => {
          // let message: string = error as string;
          // this.showSnackBar(message);
          // },
          // () => {
          // this.showSnackBar('Attachment Uploaded');

          // })
        }
      }
    }
  }

  /**
  * Open any dialog
  * @param component Dialog Component to open
  * @param data Optional data to pass along
  */
  private createDialog(component, data?: any, width: string = '600px', disableClose: boolean = false) {
    const dialogRef = this.dialog.open(component, { panelClass: 'full-width-dialog' });
    const instance: any = dialogRef.componentInstance;
    instance.width = width;
    instance.disableClose = disableClose;
    instance.data = data;
    return dialogRef;
  }


  /**
   * onDestroy
   */
  public ngOnDestroy(): void {
    if (this.subscriptionDialogue) {
      this.subscriptionDialogue.unsubscribe();
    }
  }

}
