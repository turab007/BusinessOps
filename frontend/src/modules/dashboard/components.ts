import {
    DashboardComponent, DashboardService
} from './';

import {
    ManageGroupSpacesComponent,FormGroupSpaceComponent
} from 'modules/workspace/';

import {ManageEmployeeComponent} from 'modules/employee';


export const BASE_COMPONENTS = [
    DashboardComponent,
    ManageGroupSpacesComponent,
    FormGroupSpaceComponent,
    ManageEmployeeComponent
];

export const BASE_PROVIDERS = [
    DashboardService
];

export const BASE_ENTRY = [
    ManageGroupSpacesComponent,
    FormGroupSpaceComponent,
    ManageEmployeeComponent

];