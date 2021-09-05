import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material';

import { CovalentDataTableModule } from '@covalent/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { SettingsRouting } from './settings-routing';
import { MODULE_COMPONENTS, MODULE_PROVIDERS, ENTRY_PROVIDERS } from './components';
import { LayoutService } from 'modules/layout/services/layout.service';

import { SetDepthDirective } from './directives/set-depth.directive';

import { CKEditorModule } from 'ng2-ckeditor';


import { ValidateOnBlurDirective } from './directives/validate-onblur.directive';


@NgModule({
    imports: [
        ReactiveFormsModule,
        CovalentDataTableModule,
        SettingsRouting,
        SharedModule,
        MatTabsModule,
        CKEditorModule
    ],
    declarations: [
        SetDepthDirective,
        MODULE_COMPONENTS,
        ValidateOnBlurDirective

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
export class SettingsModule {

    constructor(private messageService: LayoutService) {
        // console.log('Setting Moudle');
        // this.messageService.sendMessage('Message from Home Component to App Component!');
        // console.log('Sending message');
    }

}