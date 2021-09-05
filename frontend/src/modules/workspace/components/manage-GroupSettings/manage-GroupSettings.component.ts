import { Component, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
// import { BasicServiceService } from '../../../shared'
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlashService } from './../../../layout';
import { Subscription } from 'rxjs/Subscription';
import { UserService, User } from '../../../settings'
import { AppletDialogueComponent, WorkSpace, WorkspaceService, ManageGroupSettingsService, FormGroupSettingsComponent } from '../../'
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { LayoutService, DialogueService } from 'modules/layout/';
import { menuArr } from 'modules/workspace/menu';
import { _ } from 'lodash-node';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-manage-GroupSettings',
  templateUrl: './manage-GroupSettings.component.html',
  styleUrls: ['./manage-GroupSettings.component.css', '../../stylesheets/modal-styles.css'],
  providers: [DialogueService, UserService, ManageGroupSettingsService]
})
export class ManageGroupSettingsComponent implements OnInit {

  constructor(
    // public basicService: BasicServiceService
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _workSpaceService: WorkspaceService,
    private _dialogueService: DialogueService,
    private _menuService: LayoutService,
    // private _userService: UserService,
    private _manageGroupSettingsService: ManageGroupSettingsService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar, ) {

    this.loadWorkSpace();
  }

  public ws: WorkSpace; //CURRENT WORKSPACE
  public subscriptionDialogue: Subscription;
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;
  public userList: User[]; //LIST OF ALL THE USERS
 public userRoles: string[] //POSSILE ROLES OF USERS 


  ngOnInit() {
    // let data= this.basicService.loadWorkSpace();
    console.log('this is data');
    this.getRoles();


  }

  

  getRoles() {
    this._manageGroupSettingsService.getRoles().subscribe(roles => {
      this.userRoles = roles;
      console.log('this is roles', this.userRoles);

    })
  }

 

  /**
   * UPDATE ROLE OF USER IN WORKSPACE
   * @param user USER WHOSE ROLE IS TO BE UPDATED
   */
  updateUserRole(user: User, role: string) {

    this._manageGroupSettingsService.updateRole(user, this.ws, role).subscribe(res => {
      // console.log('this is response of update', res);
      // this.getUsers();
      this.reloadWorkSpace();
    })
  }

    /**
* FETCHES ALL USERS TO SHOW IN AUTOCOMPLETE
*/
getUsers() {
  this._manageGroupSettingsService.getUsers(this.ws).subscribe(res => {
    this.userList = (<any>res).users;
    console.log("users list ", this.userList);
    // this.filterUsers();

  },
    error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
}

  /**
   * DELETE A USER FROM A WORKSPACE
   */

  deleteUser(user: User) {
    this._dialogService.openConfirm({
      message: 'Are you sure you want to remove this user?',
      disableClose: false, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: 'Confirm', //OPTIONAL, hides if not provided
      cancelButton: 'Disagree', //OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'Agree', //OPTIONAL, defaults to 'ACCEPT'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // DO SOMETHING
        // console.log("i want to be deleted", this.selectedEod);
        this._manageGroupSettingsService.removeUser(user, this.ws).subscribe(res => {
          console.log('Deleted', res);
          this.showSnackBar('User has been removed from Workspace ');
          this.reloadWorkSpace();
          this.getUsers();
        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      } else {
        // DO SOMETHING ELSE
      }
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
  * DISPLAYS SNACKBAR
  * @param message STRING TO BE DISPLAYED
  */

  private showSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 1000,
    });
  }

  /**
   * LOADS WORKSPACE
   */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        this.setRecord(wsId);
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * Set WorkSpace Record
  */
  setRecord(id: string): void {

    this._workSpaceService.findByID(id).
      subscribe(
      ws => {
        this.ws = ws;
        this.subScribeAppletDialogue();
        console.log('this is workspace object', this.ws);

        this.setMenu(ws._id);
        this.setBreadCrumbs();
        this.getUsers();

      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
        // console.log('this is error ', error);

      })
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
      // call back error
    });
  }

  /**
  * SETS BREADCRUMBS
  */

  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { title: 'EOD Reports' }
    ])
  }


  /**
   * Set Menu from workSpace
   * @param wsId 
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
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('EOD reports subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(result => {
        const data = {
          workSpace: this.ws
        }

        // console.log('this is subscription ',this.subscriptionDialogue);

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        });
    }

  }
  /**
   * OPEN DIALOGUE TO ADD A USER TO A WORKSPACE
   */
  public addUserToWs() {
    const data={
      workSpace:this.ws,
    }

    this.createDialog(FormGroupSettingsComponent,data).afterClosed().subscribe(result=>{
      if(result)
      {
      this.reloadWorkSpace();
      }
    })

  }

  /**
   * Open any dialog
   * @param component Dialog Component to open
   * @param data Optional data to pass along
  */
  private createDialog(component, data?: any, width: string = '700px', disableClose: boolean = false) {
    const dialogRef = this.dialog.open(component, { panelClass: 'full-width-dialog' });
    const instance: any = dialogRef.componentInstance;
    instance.width = width;
    instance.disableClose = disableClose;
    instance.data = data;
    return dialogRef;
  }

  ngOnDestroy(): void {
    // this.dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue) {
      // console.log(this.subscriptionDialogue);
      this.subscriptionDialogue.unsubscribe();
    }
  }

}
