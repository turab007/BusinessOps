import { Injectable, EventEmitter,Inject,forwardRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FlashService } from './../../layout';
import { WorkSpace, WorkspaceService, AppletDialogueComponent } from '../../workspace';
import { LayoutService, DialogueService } from 'modules/layout/';
import { Subscription } from 'rxjs/Subscription';
import { menuArr } from 'modules/workspace/menu';
import { _ } from 'lodash-node';

@Injectable()
export class BasicServiceService {

    constructor(
        // @Inject(forwardRef(() => WorkspaceService))
        private route: ActivatedRoute,
        // private _workSpaceService: WorkspaceService,
        private _menuService: LayoutService,
        public dialog: MatDialog
    ) { }

    private ws: WorkSpace;
    private subscriptionDialogue: Subscription;
    private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;


//     /**
//      * LOADS WORKSPACE
//      */
//     public loadWorkSpace() {
//         this.route.params.subscribe(
//             params => {
//                 let wsId = params['ws_id'];

//                 this.setRecord(wsId);
//             },
//             error => {
//                 FlashService.instance.setFlashMessage("", "something went wrong");
//             },
//         ()=>
//     {
//         let data={
//             ws: this.ws,
//             subscriptionDialogue:this.subscriptionDialogue,
//             dialogRefWorkSpace:this.dialogRefWorkSpace
//         }
//         return data;

        
//     });
//     }


//     /**
//      * Set WorkSpace Record
//     */
//     setRecord(id: string): void {

//         this._workSpaceService.findByID(id).
//             subscribe(
//             ws => {
//                 this.ws = ws;
//                 this.subScribeAppletDialogue();

//                 this.setMenu(ws._id);
//                 this.setBreadCrumbs();
//                 // this.getEodReports();
//                 // this.getUsers();

//             },
//             error => {
//                 FlashService.instance.setFlashMessage("", "something went wrong");
//                 // console.log('this is error ', error);

//             })
//     }
//     /**
// * Subscribe the applet dialogue
// */
//     private subScribeAppletDialogue() {

//         let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
//         if (emitter) {
//             // console.log('EOD reports subscribing to dialog service');

//             this.subscriptionDialogue = emitter.subscribe(result => {
//                 const data = {
//                     workSpace: this.ws
//                 }

//                 // console.log('this is subscription ',this.subscriptionDialogue);

//                 this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
//                     this.reloadWorkSpace();
//                     this.dialogRefWorkSpace = null;
//                 },
//                     error => {
//                         FlashService.instance.setFlashMessage("", "something went wrong");
//                     });
//             },
//                 error => {
//                     FlashService.instance.setFlashMessage("", "something went wrong");
//                 });
//         }

//     }


//     /**
//      * Set Menu from workSpace
//      * @param wsId 
//      */
//     private setMenu(wsId: string) {
//         menuArr['sub_module'] = this.ws.name;
//         let menu = menuArr;
//         let applets = _.map(this.ws['applets'], "name");

//         menu.applet_links = _.filter(menu.all_applets, (link) => {
//             if (_.includes(applets, link.applet)) {
//                 return link;
//             }
//         })

//         //set menu 
//         this._menuService.setMenu(menu, ":id", wsId);

//     }


//     /**
//      * SETS BREADCRUMBS
//      */

//     setBreadCrumbs() {
//         this._menuService.setBreadCrumb([
//             { url: '/dashboard', title: 'Dashboard' },
//             { url: '/workspace/' + this.ws._id, title: 'Workspace' },
//             { title: 'EOD Reports' }
//         ])
//     }

//     /**
//  * Open any dialog
//  * @param component Dialog Component to open
//  * @param data Optional data to pass along
// */
//     private createDialog(component, data?: any, width: string = '700px', disableClose: boolean = false) {
//         const dialogRef = this.dialog.open(component, {});
//         const instance: any = dialogRef.componentInstance;
//         instance.width = width;
//         instance.disableClose = disableClose;
//         instance.data = data;
//         return dialogRef;
//     }

//     /**
// * Reload work space need on menu close
// */
//     private reloadWorkSpace() {
//         //get workspace from database
//         this._workSpaceService.findByID(this.ws._id).subscribe((ws) => {
//             this.ws = ws;
//             this.setMenu(this.ws._id);

//         }, error => {
//             // call back error
//         });
//     }

}