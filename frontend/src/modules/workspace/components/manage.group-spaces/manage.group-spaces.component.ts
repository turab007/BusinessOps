import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { _ } from 'lodash-node'
// import { ObservableMedia } from "@angular/flex-layout";
import { Observable } from "rxjs/Observable";

import { WorkSpace } from '../../';
import { WorkspaceService } from './../../'
import { FlashService } from './../../../layout';
import { ErrorHandlerService } from '../../../shared';

@Component({
  selector: 'app-manage.group-spaces',
  templateUrl: './manage.group-spaces.component.html',
  styleUrls: ['./manage.group-spaces.component.css', '../../stylesheets/modal-styles.css'],
  providers: [WorkspaceService, ErrorHandlerService]

})
export class ManageGroupSpacesComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ManageGroupSpacesComponent>,
    private _workSpaceService: WorkspaceService,
    private changeDetector: ChangeDetectorRef,
    private _errorService: ErrorHandlerService,
    @Inject(MatDialogRef) public data: any,
    // private observableMedia: ObservableMedia
  ) { }

  public groupSpaces: WorkSpace[];
  // public activeWorkSpaces: any[];

  // public totalRecords: number;
  // public queryStrings: Object = {};
  // public cols: Observable<number>;





  ngOnInit() {
    this.groupSpaces = this.data.all_workSpaces;
    console.log("this is groupspaces ",this.groupSpaces);
    // this.setGridListCol();
  }


  /**
   * Get all the created workspaces
   */
  private getGroupSpaces() {
    // this._workSpaceService.index_not_personal_paged(this.queryStrings).subscribe(
    //   response => {
    //     console.log('response: ', response['workSpaces']);
    //     // check if already added
    //     this.groupSpaces = _.map(response['workSpaces'], (ws) => {
    //       if (_.includes(this.activeWorkSpaces, ws._id))
    //         ws.is_active = true;
    //       else
    //         ws.is_active = false;
    //       if (ws.space_type == 'Personal')
    //         ws.personal = true;
    //       return ws;

    //     });

    //     this.totalRecords = response["totalCount"];
    //     console.log(this.groupSpaces);
    //   },
    //   error => console.log(error)
    // )
  }

  // /**
  // * Set grid list view cols and observe for screen changes
  // */
  // setGridListCol() {

  //   // set cols
  //   if (this.observableMedia.isActive('xs')) {
  //     this.cols = Observable.of(1);
  //   } else if (this.observableMedia.isActive('sm') || this.observableMedia.isActive('md')) {
  //     this.cols = Observable.of(2);
  //   } else if (this.observableMedia.isActive('lg') || this.observableMedia.isActive('xl')) {
  //     this.cols = Observable.of(3);
  //   }

  //   // observe changes
  //   this.observableMedia.asObservable()
  //     .subscribe(change => {
  //       switch (change.mqAlias) {
  //         case 'xs':
  //           this.cols = Observable.of(1);
  //           this.changeDetector.markForCheck();
  //           return;
  //         case 'sm':
  //         case 'md':
  //           this.cols = Observable.of(2);
  //           this.changeDetector.markForCheck();
  //           return;
  //         case 'lg':
  //         case 'xl':
  //           this.cols = Observable.of(3);
  //           this.changeDetector.markForCheck();
  //           return;
  //       }
  //     }, error => {
  //       this._errorService.handleError(error);
  //     });
  // }



  // public addWorkSpace(ws: WorkSpace) {
  //   this._workSpaceService.add(ws).subscribe(
  //     response => {
  //       this.dialogRef.close();
  //       this.showSnackBar("Group Space has been added");
  //     },
  //     error => console.log(error)
  //   )
  // }




  /**
     * toggle workspace
     * @param ws 
     */
  public toggleWorkSpace(model: WorkSpace, action: string) {

    let newRecord: WorkSpace = {
      name: model.name,
      description: model.description,
      is_active: !model.is_active
    };;
    this._workSpaceService.save(newRecord, model).subscribe((result) => {
      if (result) {
        this.dialogRef.close();
        FlashService.instance.setFlashMessage("", "workspace " + action);
      }
    }, error => {
      FlashService.instance.setFlashMessage("", "something went wrong");
    });
  }



  /**
   * CLOSE DIALOG
   */
  public close() {
    this.dialogRef.close();
  }
}
