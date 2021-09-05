import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { EodReport, EodService } from '../../../../';
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-form-add-eod',
  templateUrl: './form-add-eod.component.html',
  styleUrls: ['./form-add-eod.component.css'],
  providers: [EodService,]
})
export class FormAddEodComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormAddEodComponent>,
    private fb: FormBuilder,
    private eodService: EodService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public eodForm: FormGroup; //FORMGROUP FOR EODFORM
  public editState: boolean = false; //TELLS IF WE'RE IN EDIT MODE
  public editEod: EodReport = null; //STORES EODREPORT PASSED BY PARENT IN EDIT STATE
  public formHeading: string = "Add New EOD"; //HEADING OF EODFORM (EDIT FORM OR ADD FORM)

  //COMPONENT LABELS FOR FORM COMPONENTS
  public componentLabels = {
    date: 'Report Date',
  }

  //SETTINGS FOR CKEDITOR
  ckEditorConfig: any = {
    uiColor: '#E4E5E4', placeholder: 'Add Description', width: 500, height: 500,
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
    this.generateFormContorls();
    console.log("this is data ", this.data.work_space);
    if (this.data.report) {
      console.log("Inside ngOninit");
      this.editEod = this.data
      this.editState = true;
      this.formHeading = "Edit existing EOD";
    }
  }

  /**
   *GENERATES FORM CONTROLS FOR EODFORM 
   */

  public generateFormContorls() {
    this.eodForm = this.fb.group({
      date: ['', Validators.required],
      report: ['', Validators.required]
    });
  }

  /**
   * SAVES EODFORM 
   * @param model1 VALUES OF EODFORM
   * @param isValid IF FORM IS VALID
   */
  save(model1: EodReport, isValid: boolean) {

    if (isValid) {

      console.log('this is wSID', this.data.work_space);



      let model: EodReport = {
        work_space: this.data.work_space,
        date: model1.date,
        report: model1.report

      }
      console.log('this is save model', model);

      this.eodService.save(model, this.editEod, this.data.work_space).subscribe(result => {
        console.log('saved', result);
        this.dialogRef.close();
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        })

    }
  }


}
