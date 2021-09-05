import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { _ } from "lodash-node";
import { AppletService, WorkspaceService, WorkSpace, Applet } from 'modules/workspace'
// import { ObservableMedia } from "@angular/flex-layout";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-applet-dialogue',
  templateUrl: './applet-dialogue.component.html',
  styleUrls: ['./applet-dialogue.component.css', '../../stylesheets/modal-styles.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppletDialogueComponent implements OnInit {


  public applets: Applet[];
  public ws: WorkSpace;
  // public cols: Observable<number>;


  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AppletDialogueComponent>,
    private _appletService: AppletService,
    private _workSpaceService: WorkspaceService,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private observableMedia: ObservableMedia
  ) { }

  ngOnInit() {
    //load workspace from data
    // console.log(this.data);
    this.ws = this.data.workSpace;
    this.getAppletData();
    // this.setGridListCol();
  }


  /**
   * Get Services data of all applets
  */
  public getAppletData() {
    this._appletService.index().subscribe(response => {

      this.applets = _.map(response, (applet) => {
        // console.log(applet);
        if (this.ws.modules && _.includes(this.ws.modules, applet._id)) {
          applet.personal = true;
        }
        else {
          applet.personal = false;
        }
        return applet;
      });

      // console.log(this.applets);

    },
      error => console.log(error)
    ) // end of subscribe
  }


//   /**
// * Set grid list view cols and observe for screen changes
// */
//   setGridListCol() {

//     // set cols
//     if (this.observableMedia.isActive('xs')) {
//       this.cols = Observable.of(1);
//     } else if (this.observableMedia.isActive('sm') || this.observableMedia.isActive('md')) {
//       this.cols = Observable.of(2);
//     } else if (this.observableMedia.isActive('lg') || this.observableMedia.isActive('xl')) {
//       this.cols = Observable.of(3);
//     }

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
  //     });
  // }


  /**
   * Add Applet to current WorkSpace
   * @param model 
   */
  public addAppletToWorkSpace(model: Applet) {
    this._workSpaceService.addApplet(model, this.ws).subscribe(
      response => {
        this.dialogRef.close();
        this.showSnackBar("Applet has been add to GroupSpace.");

      },
      error => console.log(error)
    ) // end of subscribe
  }


  /**
   * Remove Applet from Current WorkSpace
   * @param model 
   */
  public removeAppletFromWorkSpace(model: Applet) {
    this._workSpaceService.removeApplet(model, this.ws).subscribe(
      response => {

        this.dialogRef.close();
        this.showSnackBar("Applet has been removed From GroupSpace.");

      },
      error => console.log(error)
    ) // end of subscribe
  }


  /**
   * Close dialogue
  */
  public closeDialogue() {
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
