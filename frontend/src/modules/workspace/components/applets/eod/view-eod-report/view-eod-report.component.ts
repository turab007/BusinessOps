import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { EodService } from '../../../../';
import { EodReport } from '../../../../';

@Component({
  selector: 'app-view-eod-report',
  templateUrl: './view-eod-report.component.html',
  styleUrls: ['./view-eod-report.component.css'],
  providers: [EodService]
})
export class ViewEodReportComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewEodReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private eodService: EodService) { }

  public eodReport; //STORES EODREPORT TO DISPLAY 

  //SETTINGS FOR CKEDITOR
  ckEditorConfig: any = {
    uiColor: '#E4E5E4', placeholder: 'Add Description',
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

  ngOnInit() {
    this.eodReport = this.data;
    console.log("Inside view eod", this.eodReport);
  }


}
