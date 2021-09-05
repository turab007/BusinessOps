import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

import { CKEditorModule } from 'ng2-ckeditor';

import { SharedModule } from '../shared/shared.module';
import { WorkSpaceRoutingModule } from './workspace-routing.module';
import { WORKSPACE_COMPONENTS, WORKSPACE_PROVIDERS, ENTRY_PROVIDERS, WORKSPACE_DIRECTIVES } from './components';
import { CovalentDialogsModule,CovalentDataTableModule,CovalentSearchModule } from '@covalent/core';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  imports: [
    ReactiveFormsModule,
    WorkSpaceRoutingModule,
    SharedModule,
    FormsModule,
    DragulaModule,
    CovalentDialogsModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CKEditorModule,
  ],
  declarations: [
    WORKSPACE_COMPONENTS,
    WORKSPACE_DIRECTIVES


  ],
  providers: [
    WORKSPACE_PROVIDERS
  ],
  entryComponents: [
    ENTRY_PROVIDERS

  ]
  
})
export class WorkspaceModule {

}
