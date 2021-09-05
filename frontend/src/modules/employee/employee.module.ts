import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHomeComponent } from './components/employee-home/employee-home.component';
import { EmployeeRoutingModule } from './employee-routing.module'
import { EMPLOYEE_COMPONENTS, EMPLOYEE_DIRECTIVES, EMPLOYEE_PROVIDERS, ENTRY_PROVIDERS } from './components'
import {SharedModule} from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {TimeAgoPipe} from 'time-ago-pipe';


@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    EMPLOYEE_COMPONENTS,
    EMPLOYEE_DIRECTIVES,
    // TimeAgoPipe
  ],
  providers: [
    EMPLOYEE_PROVIDERS
  ],
  entryComponents: [
    ENTRY_PROVIDERS
  ]
})
export class EmployeeModule { }