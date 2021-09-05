import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeService, Employee } from '../../';
import { _ } from 'lodash-node'
// import { ObservableMedia } from "@angular/flex-layout";
import { Observable } from "rxjs/Observable";
import { Router } from '@angular/router';

import { FlashService } from './../../../layout';
import { ErrorHandlerService } from '../../../shared';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css'],
  providers: [EmployeeService]
})
export class ManageEmployeeComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ManageEmployeeComponent>,
    private _employeeService: EmployeeService,
    // @Inject(mat_DIALOG_DATA) public data: any,
    // private observableMedia: ObservableMedia,
    private changeDetector: ChangeDetectorRef,
    private router: Router) { }

  public employees: Employee[];
  // public cols: Observable<number>;


  ngOnInit() {
    // this.setGridListCol();
    this._employeeService.index().subscribe(emp => {
      this.employees = emp.employees;
      console.log("these are my employees", this.employees);

      this.employees.forEach(emp => {
        console.log("type:", emp.user);
      })
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })


  }

  /**
   *  NAVIGATES TO SELECTED EMPLOYEE
   * @param emp EMPLOYEE TO NAVIGATE TO
   */
  navigate(emp: Employee) {
    EmployeeService.currentEmployee = emp; //SAVE EMPLOYEE OBJECT IN SERVICE
    this.router.navigate(['/employee', emp._id]);
    this.close();


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
  //       FlashService.instance.setFlashMessage("", "Something went wrong");
  //     });
  // }



  /**
   * CLOSE DIALOG
   */
  public close() {
    this.dialogRef.close();
  }

}
