import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentFileModule } from '@covalent/core';

import { SharedModule } from '../shared/shared.module';

import { MODULE_COMPONENTS, MODULE_PROVIDERS, ENTRY_PROVIDERS } from './components';
import { BusinessOppRouting } from './business-opps.routes';

import { SideNavService } from 'modules/layout/'
import { DragulaModule } from 'ng2-dragula';


@NgModule({
    imports: [
        ReactiveFormsModule,
        BusinessOppRouting,
        SharedModule,
        DragulaModule,
        CovalentFileModule

    ],
    declarations: [
        MODULE_COMPONENTS,

    ],
    providers: [
        MODULE_PROVIDERS,

    ],
    entryComponents: [
        ENTRY_PROVIDERS
    ],
    exports: [

    ]
})
export class BusinessOppModule {
    constructor(private navService: SideNavService) {
        console.log("---businesss--");
        this.navService.setNav(true);
    }
}