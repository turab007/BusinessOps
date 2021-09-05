import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { CovalentLayoutModule, CovalentStepsModule,CovalentDataTableModule } from '@covalent/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        CovalentLayoutModule,
        CovalentStepsModule,
        ReactiveFormsModule,
        CovalentDataTableModule,
        SharedModule,
        RouterModule
    ],
    declarations: [

    ],
    providers: [
    ],
    exports: [

    ]
})
export class BaseModule { }