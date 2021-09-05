import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { menuArr } from '../../../../menu';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppletDialogueComponent, Approval, WorkSpace, WorkspaceService, ApprovalService, FormAddApprovalComponent } from '../../../../'
import { LayoutService, DialogueService } from '../../../../../layout';
import { Subscription } from "rxjs";
import { _ } from 'lodash-node';
import { ActivatedRoute } from '@angular/router';
import { FlashService } from './../../../../../layout';


@Component({
  selector: 'app-approvals-home',
  templateUrl: './approvals-home.component.html',
  styleUrls: ['./approvals-home.component.css','../stylesheets/approvals-styles.css'],
  providers: [DialogueService, ApprovalService]
})
export class ApprovalsHomeComponent implements OnInit, OnDestroy {

  constructor(private menuService: LayoutService,
    public dialog: MatDialog,
    private _workSpaceService: WorkspaceService,
    private route: ActivatedRoute,
    private dialogueService: DialogueService,
    private approvalService: ApprovalService) { }

  public ws: WorkSpace; //CURRENT WORKSPACE
  public subscriptionDialogue: Subscription;
  // public approvalGroups: any[] = ['Pending', 'Approved', 'Rejected', 'Expired']; //LIST OF APPROVAL GROUPS
  public approvalGroups: any[];
  public approvals: Approval[]; //ALL APPROVALS
  public totalRecords: 0; //TOTAL NUMBER OF RECORDS
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;

  ngOnInit() {
    this.loadWorkSpace();

  }


  /**
   * SETS BREADCRUMBS
   */
  setBreadCrumbs() {
    this.menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { title: 'Approvals' }
    ])
  }

  /**
* Subscribe the applet dialogue
*/
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('Approval home subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(res => {
        const data = {
          workSpace: this.ws
        }


        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
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
    this.menuService.setMenu(menu, ":id", wsId);

  }
  /**
   * Get approvals against workspace
   */
  private getApprovals() {
    let queryString = {};
    this.approvalService.index_paged(queryString, this.ws._id).subscribe(response => {
      // console.log("-----------");
      // console.log(response);
      this.approvals = response['approvals'];
      console.log("i am getting these approvals ",this.approvals);
      this.totalRecords = response["totalCount"];
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }

  /**
   * ADD NEW APPROVAL
   */

  public addApprovals() {

    const data = {
      action: 'create',
      workSpace: this.ws,
    };
    this.createDialog(FormAddApprovalComponent, data).afterClosed().subscribe(res => {
      this.getApprovals();
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    })
    // this.approvalService.create(,this.ws._id).subscribe(res=>
    // {

    // })
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
 * Load the current workSpace
*/
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        this.setRecord(wsId);
      }, error => {
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
        this.setMenu(ws._id);
        this.approvalGroups=this.approvalService.getApprovalGroups();
        // Get all lists now 
        this.getApprovals();
        this.setBreadCrumbs();
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
        this.menuService.setMenu(menuArr);

      });
  }

  /**
    * onDestroy
    */
  ngOnDestroy(): void {
    // this.dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue) {
      // console.log(this.subScribeAppletDialogue);
      this.subscriptionDialogue.unsubscribe();
    }

  }



}
