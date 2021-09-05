import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import {
    TdDialogService
} from '@covalent/core';
import { FlashService } from './../../../layout';



import { LayoutService } from '../../../layout/';
import { ProfileService } from '../../../settings/';
import {
    WorkSpace, WorkspaceService,
    FormGroupSpaceComponent, ManageGroupSpacesComponent
} from '../../../workspace/';

import { ManageEmployeeComponent } from '../../../employee';
import { DeleteDialogComponent } from '../../../shared';

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProfileService, WorkspaceService]
})
export class DashboardComponent implements OnInit {

    constructor(private router: Router,
        private menuService: LayoutService,
        private profileService: ProfileService,
        private changeDetector: ChangeDetectorRef,
        // private observableMedia: ObservableMedia,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private _dialogService: TdDialogService,
        private _workSpaceService: WorkspaceService,
    ) {
    }

    public workSpaces: WorkSpace[]; //ALL WORKSPACES
    public cols: Observable<number>;
    public permission;
    public current_user: string; //CURRENT USER
    private dialogRefWorkSpace: MatDialogRef<FormGroupSpaceComponent>;
    public appletCount; // ARRAY THAT CONTAINS COUNT OF ALL LISTS, TASK, APPROVALS AND EOD OF EVERY USER WS

    ngOnInit() {
        // console.log("Date", new Date().toISOString());
        this.menuService.setBreadCrumb([
            { title: 'Dashboard' }
        ]);
        // set current user;
        this.current_user = localStorage.user_id;
        this.permission = localStorage.perm;

        this.getWorkSpaces();
        // this.setGridListCol();
    }

    /**
     * Fetch workspaces
     */
    getWorkSpaces() {

        this.profileService.getWorkSpaces().subscribe(value => {
            this.workSpaces = value;
            console.log("workspaces: ", this.workSpaces)
            this.changeDetector.markForCheck();
        }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");

        });

        this.profileService.getAppletCount().subscribe(res=>
        {
            this.appletCount=res;
            console.log("this is applet count", this.appletCount);
        })
    }

    /**
     * navigate to url
     * @param url to navigate to
     * @param param router params to pass along
     */
    navigate(url: string, param: string) {
        // [routerLink] = "['/workspace/',ws._id]"
        this.router.navigateByUrl(url + param);
    }

    // /**
    //  * Set grid list view cols and observe for screen changes
    //  */
    // setGridListCol() {

    //     // set cols
    //     if (this.observableMedia.isActive('xs')) {
    //         this.cols = Observable.of(1);
    //     } else if (this.observableMedia.isActive('sm') || this.observableMedia.isActive('md')) {
    //         this.cols = Observable.of(3);
    //     } else if (this.observableMedia.isActive('lg') || this.observableMedia.isActive('xl')) {
    //         this.cols = Observable.of(5);
    //     }

    //     // observe changes
    //     this.observableMedia.asObservable()
    //         .subscribe(change => {
    //             switch (change.mqAlias) {
    //                 case 'xs':
    //                     this.cols = Observable.of(1);
    //                     this.changeDetector.markForCheck();
    //                     return;
    //                 case 'sm':
    //                 case 'md':
    //                     this.cols = Observable.of(3);
    //                     this.changeDetector.markForCheck();
    //                     return;
    //                 case 'lg':
    //                 case 'xl':
    //                     this.cols = Observable.of(5);
    //                     this.changeDetector.markForCheck();
    //                     return;
    //             }
    //         }, error => {
    //             FlashService.instance.setFlashMessage("", "Something went wrong");

    //         });
    // }

    /**
     * Manage Groupspaces 
     * OR Browse Group spaces
     */
    manageGroupSpaces() {
        let data = { 'all_workSpaces': this.workSpaces };
        this.createDialog(ManageGroupSpacesComponent, data).afterClosed().subscribe(
            res => {
                this.getWorkSpaces();
            }, error => {
                FlashService.instance.setFlashMessage("", "Something went wrong");

            }
        )
    }

    /**
     * MANAGE EMPLOYEE DIALOG
     */
    manageEmployees() {
        this.createDialog(ManageEmployeeComponent).afterClosed().subscribe(res => {
            console.log("Dialogue closed");
        })
    }

    /**
     * Update passed workspace
     * @param ws Workspace to update
     */
    public updateGroupSpace(ws: WorkSpace, $event) {
        this.stopPropagation($event);
        const data = {
            action: 'update',
            workSpace: ws
        }
        this.createDialog(FormGroupSpaceComponent, data).afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                // load again workspaces
                this.getWorkSpaces();
            }
            this.dialogRefWorkSpace = null;
        }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");

        });
    }

    /**
     * Add new groupspace to list
    */
    public addGroupSpace() {
        const data = {
            action: 'create',
        };
        this.createDialog(FormGroupSpaceComponent, data).afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                // load again workspaces
                this.getWorkSpaces();
            }
            this.dialogRefWorkSpace = null;
        }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");

        });

    }

    /**
     * Removes WS from list
     * @param model : WorkSpace
     */
    public removeWorkspace(model: WorkSpace, $event) {
        this.stopPropagation($event);

        const data = {
            type: 'WS',
            object: model
        }

        this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
            if (result) {
                this._workSpaceService.delete(model._id).subscribe(res => {
                    if (res) {
                        this.getWorkSpaces()
                    }
                }, error => {
                    FlashService.instance.setFlashMessage("", "Something went wrong");
                })
            }
        })

        // this._dialogService.openConfirm({
        //     message: 'Are you sure, you want to delete?',
        //     disableClose: false,
        //     title: 'Confirm',
        // }).afterClosed().subscribe((accept: boolean) => {
        //     if (accept) {
        //         this._workSpaceService.delete(model._id).subscribe((result) => {
        //             if (result) {
        //                 this.getWorkSpaces();
        //             }
        //         }, error => {
        //             FlashService.instance.setFlashMessage("", "Something went wrong");

        //         });
        //     }
        // });

    }

    /**
     * CHECKS IF ONE ELEMENT LIES BEFORE THE OTHER
    */
    isbefore(a, b) {
        // if (a.parentNode === b.parentNode) {
        //     for (let cur = a; cur; cur = cur.previousSibling) {
        //         if (cur === b) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        // return null;
    }


    /**
    * LIST ITEM DRAG ENTERED
    */
    dragEnter(index: number, $event) {
        // TODO: NOT WORKING AS EXPECTED

        // if (this.source !== index) {
        //     let temp = this.workSpaces[this.source];
        //     this.workSpaces[this.source] = this.workSpaces[index];
        //     this.workSpaces[index] = temp;
        //     this.changeDetector.markForCheck();
        // }
    }

    /**
     * LIST ITEM DRAG STARTED
     */
    dragStart(index: number, $event) {
        // this.source = index;
        // $event.dataTransfer.effectAllowed = 'move';
    }

    stopPropagation($event) {
        if ($event.stopPropagation) {
            // FOR IE 8+
            $event.stopPropagation();
        } else {
            // FOR IE < 8
            $event.returnValue = false;
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
     * Show SNACKBAR
     * @param message Message to display
     */
    private showSnackBar(message: string): void {
        this.snackBar.open(message, '', {
            duration: 1000,
        });
    }
}