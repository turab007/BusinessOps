import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { WorkSpaceComponent, ListComponent, AppletDialogueComponent, EodReportsHomeComponent, FormAddApprovalComponent } from './';
import { ApprovalsHomeComponent, FormAddEodComponent, ManageGroupSettingsComponent } from './';
import { SharedModule } from '../shared/shared.module';

import { TasksHomeComponent, TaskViewComponent, ApprovalViewComponent } from './';


const routes: Routes = [
  {
    path: '',
    component: WorkSpaceComponent,
    data: {
      title: 'WorkSpace'
    }
  },
  {
    path: ':id',
    component: WorkSpaceComponent,
    data: {
      title: 'View',
      action: 'view'
    }
  },
  {
    path: ':ws_id/eodReports',
    children: [
      {
        path: '',
        component: EodReportsHomeComponent,
        data: {
          title: 'EOD Reports'
        }
      },
      // {
      //   path: 'create',
      //   component: FormAddEodComponent,
      //   data: {
      //     title: 'Add EOD Report'
      //   }
      // },
    ]
  },
  {
    path: ':ws_id/lists',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          title: 'Lists'
        }
      },
    ]

  },
  {
    path: ':ws_id/tasks',
    component: TasksHomeComponent,
    data: {
      title: 'Tasks'
    },
  },
  {
    path: ':ws_id/tasks/:g_id/:ts_id',
    component: TaskViewComponent,
    data: {
      title: 'View'
    },
  },
  {
    path: ':ws_id/approvals',
    component: ApprovalsHomeComponent,
    data: {
      title: 'Approvals'
    },
  }, 
  // {
  //   path: ':ws_id/approvals/new_approval',
  //   component: FormAddApprovalComponent,
  //   data: {
  //     title: 'Approvals'
  //   },
  // },
  {
    path: ':ws_id/approvals/:ap_id',
    component: ApprovalViewComponent,
    data: {
      title: 'View'
    },
  },
  {
    path: ':ws_id/settings',
    component: ManageGroupSettingsComponent,

  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class WorkSpaceRoutingModule { }
