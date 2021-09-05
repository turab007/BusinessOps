import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { BASE_PROVIDERS, BASE_COMPONENTS, BASE_ENTRY } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        SharedModule,
        DashboardRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        BASE_COMPONENTS
    ],
    providers: [
        BASE_PROVIDERS
    ],
    entryComponents: [BASE_ENTRY],
    exports: [
    ]
})
export class DashboardModule {
    constructor(){
    }
 }