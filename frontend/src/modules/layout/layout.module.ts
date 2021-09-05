import { NgModule } from '@angular/core';


import { RouterModule } from '@angular/router';
import { CovalentLayoutModule, CovalentStepsModule /*, any other modules */ } from '@covalent/core';

import { SharedModule } from '../shared/shared.module';
import { 
        NavComponent, PageComponent,FullLayoutComponent, LayoutService, TokenService,FlashService, 
        SimpleLayoutComponent,SideNavService } from './';

@NgModule({
    imports: [
        CovalentLayoutModule, CovalentStepsModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        NavComponent,
        PageComponent,
        FullLayoutComponent,
        SimpleLayoutComponent
    ],
    providers: [
        LayoutService,
        TokenService,
        FlashService,
        SideNavService
    ],
    exports: [

    ]
})

export class LayoutModule { }