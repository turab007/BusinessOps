import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { LayoutService, DialogueService } from 'modules/layout/';
import { menuArr } from 'modules/workspace/menu'

import { AppletDialogueComponent, WorkspaceService, WorkSpace } from '../../'

import { _ } from 'lodash-node';


@Component({
  selector: 'app-home',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [DialogueService]
})
export class WorkSpaceComponent implements OnInit, OnDestroy {

  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;
  public ws: WorkSpace;
  subscriptionDialogue: Subscription;


  constructor(private menuService: LayoutService,
    private dialogueService: DialogueService,
    public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router,
    public _workSpaceService: WorkspaceService,
    public activatedRoute: ActivatedRoute) {
  }
  /**
  *  Init method 
  */
  public ngOnInit() {
    this.loadWorkSpace();
    console.log("Inside workspace ngOninit");
    this.router.events.subscribe(res => {
      // console.log("subscribing to router change");
    })

    this.activatedRoute.params.subscribe(p => {
      console.log("Inside activated route subscription", p);
    })
  }

  setBreadCrumbs() {
    this.menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { title: 'Workspace' }
    ])
  }

  /**
   * Subscribe the applet dialogue
   */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('WorkSpace Dashboard subscribing to dialog service');
      this.subscriptionDialogue = emitter.subscribe(res => {
        const data = {
          workSpace: this.ws
        }

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        });
      });
    }
  }

  /**
   * Load the current workSpace
  */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['id'];


        //get workspace from database
        this._workSpaceService.findByID(wsId).subscribe((result) => {

          this.ws = result;
          console.log("this is ws",this.ws);

          // console.log('storage has',localStorage.perm);
          // let userID=localStorage.userID.toString();
          // console.log("this is userID",userID);

          // if(userID !=this.ws.created_by) //CHECK ROLES ONLY IF USER HAS NOT CREATED WORKSPACE
          //   {

          // //GET ROLE OF USER IN WORKSPACE
          //  this._workSpaceService.getUserRoles(this.ws).subscribe(role=>
          //   {                
          //     //GET PERMISSIONS OF USER IN WORKSPACE
          //       this._workSpaceService.getUserPermissions((<any>role)._id).subscribe(perm=>
          //       {
          //         // let newPerm;
          //         // perm.forEach(element => {
          //         //   // newPerm.push( element.controller+element.action);
          //         //   newPerm=newPerm+' , ',element.controller+' '+' '+element.action

          //         // });
          //         console.log("this is the perm ",perm);
          //         localStorage.setItem('wsPerm',perm);
          //       });
          //   });
          //   }

          this.setMenu(wsId);
          this.setBreadCrumbs();

          //subcribe the applet dialogue
          this.subScribeAppletDialogue();


        }, error => {
          // call back error
        });

        // this._workSpaceService.setUserPermissions(wsId).subscribe(res=>
        // {

        // });
      });
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
    this.menuService.setMenu(menu, ":id", wsId);

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

  ngOnDestroy(): void {
    // this.dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue)
      this.subscriptionDialogue.unsubscribe();
  }

}
