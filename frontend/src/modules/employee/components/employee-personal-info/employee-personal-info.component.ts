import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../../';

@Component({
  selector: 'app-employee-personal-info',
  templateUrl: './employee-personal-info.component.html',
  styleUrls: ['./employee-personal-info.component.css']
})
export class EmployeePersonalInfoComponent implements OnInit {

  constructor() { }

  @Input() employee:Employee;

  ngOnInit() {
    console.log('this is personal employee',this.employee)
  }

}
