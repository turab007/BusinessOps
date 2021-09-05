import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../../';

@Component({
  selector: 'app-employee',
  templateUrl: '../employee-home/employee-home.component.html',
  styleUrls: ['../employee-home/employee-home.component.css'],
  providers:[EmployeeService]
})
export class EmployeeHomeComponent implements OnInit {

  constructor(
    private _employeeService: EmployeeService,
    private router: Router
  ) { }

  public _empId: string; //EMPLOYEE ID OF CURRENT EMPLOYEE
  public employee: Employee;

  ngOnInit() {
    this.employee = EmployeeService.currentEmployee; //GET CURRENT EMPLOYEE STORED IN SERVICE
    console.log("this is home emp", this.employee);

    //GET ID OF EMPLOYEE FROM ROUTE
    console.log('activated route', this.router.url.split('/'));
    this._empId = this.router.url.split('/')[2];

    this._employeeService.findByID(this._empId).subscribe(emp => {
      this.employee = emp;
    });
  }



}
