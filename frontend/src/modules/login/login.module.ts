import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { MaterialModule } from '@angular/material'; //REWMOVED IN MATERIAL. 2.0.BETA-11
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';



import {
    MatButtonModule, MatCardModule, MatIconModule, MatRadioModule,
    MatListModule, MatMenuModule, MatTooltipModule,
    MatSlideToggleModule, MatInputModule, MatCheckboxModule,
    MatToolbarModule, MatSnackBarModule, MatSidenavModule,
    MatTabsModule, MatSelectModule, MatAutocompleteModule,



    MatGridListModule,
    MatButtonToggleModule,
    MatChipsModule,
    // MatCoreModule, //REMOVED IN MATERIAL 2.0.0-BETA.11
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSliderModule,
    // MatExpansionModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatTableModule


} from '@angular/material';


import {
    CovalentMediaModule, CovalentLoadingModule, CovalentLayoutModule,
    CovalentStepsModule, CovalentCommonModule
} from '@covalent/core';



// import {  LoginService } from './services/login.service';
// import {LoginComponent}  from './components/login.component'
import { EqualValidator } from './validate.directives/equal-validator.directive';
import { LOGIN_COMPONENTS, LOGIN_PROVIDERS } from './components';

import { LoginRoutingModule } from './login.routes'


const COVALENT_MODULES: any[] = [
    CovalentMediaModule, CovalentLoadingModule, CovalentLayoutModule,
    CovalentStepsModule, CovalentCommonModule
];

const MATERIAL_MODULES: any[] = [
    MatButtonModule, MatCardModule, MatIconModule, MatRadioModule,
    MatListModule, MatMenuModule, MatTooltipModule,
    MatSlideToggleModule, MatInputModule, MatCheckboxModule,
    MatToolbarModule, MatSnackBarModule, MatSidenavModule,
    MatTabsModule, MatSelectModule, MatAutocompleteModule,

    MatGridListModule,
    MatButtonToggleModule,
    MatChipsModule,
    // MatCoreModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSliderModule,
];


@NgModule({
    imports: [
        // MaterialModule,

        FlexLayoutModule,
        FormsModule,
        LoginRoutingModule,
        CommonModule,
        COVALENT_MODULES,
        MATERIAL_MODULES
    ],
    declarations: [
        LOGIN_COMPONENTS,
        EqualValidator
    ],
    providers: [
        //  LOGIN_PROVIDERS

    ],
    exports: [
        COVALENT_MODULES
    ]
})
export class LoginModule {
    constructor() {
        console.log("Login Moduel loaded...")
    }
}
