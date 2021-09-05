import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';


/** TODO:Low  Covelent upgrade from beta 3 to beta 4L  (Thats why placed here)*/
import {
    CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
    CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
    CovalentPagingModule, CovalentSearchModule, CovalentStepsModule,
    CovalentCommonModule, CovalentDialogsModule, CovalentChipsModule, CovalentExpansionPanelModule,
} from '@covalent/core';



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

const FLEX_LAYOUT_MODULES: any[] = [
    FlexLayoutModule,
];
/***************************************** */

import { SHARED_DIRECTIVES, SHARED_COMPONENTS, SHARED_PROVIDERS, ENTRY_COMPONENTS } from './components';


/** TODO:Low  Covelent upgrade from beta 3 to beta 4L  (Thats why placed here)*/
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

const COVALENT_MODULES: any[] = [
    CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
    CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
    CovalentPagingModule,
    CovalentCommonModule, CovalentDialogsModule, CovalentChipsModule, CovalentExpansionPanelModule,
    CovalentStepsModule
];
/***************************************** */

const routes: Routes = []

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        FormsModule,
        ReactiveFormsModule,
        MATERIAL_MODULES,
        COVALENT_MODULES,
        FLEX_LAYOUT_MODULES
    ],
    declarations: [
        SHARED_DIRECTIVES,
        SHARED_COMPONENTS
    ],
    providers: [
        SHARED_PROVIDERS
    ],
    entryComponents: [
        ENTRY_COMPONENTS
    ],

    exports: [
        SHARED_DIRECTIVES,
        SHARED_COMPONENTS,
        SHARED_PROVIDERS,
        MATERIAL_MODULES,
        COVALENT_MODULES,
        FLEX_LAYOUT_MODULES
    ]
})
export class SharedModule { }