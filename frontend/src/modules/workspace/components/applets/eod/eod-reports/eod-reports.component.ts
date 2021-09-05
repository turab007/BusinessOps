
import { Component,Output, OnInit, Input, OnChanges,EventEmitter } from '@angular/core';
import { EodReport, ViewEodReportComponent, FormAddEodComponent, EodService } from '../../../../';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteDialogComponent } from '../../../../../shared';
import { DatePipe } from '@angular/common';
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-eod-reports',
  templateUrl: './eod-reports.component.html',
  styleUrls: ['./eod-reports.component.css']
})
export class EodReportsComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private datePipe: DatePipe,
    private _eodService: EodService,
    private snackBar: MatSnackBar, ) { }

  @Input() eodReports: EodReport[]; //ALL EOD REPORTS
  @Output() eodDeleted= new EventEmitter<EodReport>();

  ngOnInit() {
    console.log("Eod reports ", this.eodReports);
  }

  /**
 * OPENS DIALOGUE TO VIEW AN EOD
 */
  viewEod(eod: EodReport) {
    
    this.createDialog(ViewEodReportComponent, eod);

  }

  editEod(event, eod: EodReport) {
    event.stopPropagation();
    this.createDialog(FormAddEodComponent, eod)
  }

  deleteEod(event,eod: EodReport) {
    event.stopPropagation();
    const data = {
      type: 'EOD',
      object: { name: 'Eod report for ' + this.datePipe.transform(eod.date) }
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        console.log("i want to be deleted", eod);
        this._eodService.delete(eod._id, eod.work_space).subscribe(res => {
          console.log('Deleted', res);
          this.showSnackBar('Eod report has been deleted ');
          // this.eodReports=null;
          this.eodDeleted.emit();
        },
          error => {
            FlashService.instance.setFlashMessage("", "something went wrong");
          });
      }
    })
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
  private createDialog(component, data?: any, width: string = '700px', disableClose: boolean = false) {
    const dialogRef = this.dialog.open(component, { panelClass: 'full-width-dialog' });
    const instance: any = dialogRef.componentInstance;
    instance.width = width;
    instance.disableClose = disableClose;
    instance.data = data;
    return dialogRef;
  }

}
