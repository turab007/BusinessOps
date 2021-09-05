import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {EmployeeHomeComponent} from './components/employee-home/employee-home.component';





const routes: Routes = [
  {
    path: ':_emp_id',
    component: EmployeeHomeComponent,
  }, 
 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
