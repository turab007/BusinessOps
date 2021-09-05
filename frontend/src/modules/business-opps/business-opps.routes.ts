import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';


import {
  LeadFormComponent,LeadIndexComponent,LeadsKanbanComponent,LeadDetailActionComponent,
  OpportunityFormComponent,OpportunityIndexComponent,OpportunitiesKanbanComponent,
  ContactFormComponent,
  ContactIndexComponent,
  CompanyIndexComponent,
  CompanyFormComponent
} from './';

const routes: Routes = [
  {
    path: '',
    component: LeadIndexComponent,
    data: {
      title: 'List all'
    }
  },
  {
    path: 'leads',
    children: [
      {
        path: '',
        component: LeadIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'index',
        component: LeadIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'kanban',
        component: LeadsKanbanComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'view/:id',
        component: LeadFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: '/:id',
        component: LeadFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'detail-actions/:id',
        component: LeadDetailActionComponent,
        data: {
          title: 'Detail Actions',
          action: 'detail_action'
        }
      },
      {
        path: 'create',
        component: LeadFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: 'update/:id',
        component: LeadFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'opportunities',
    children: [
      {
        path: '',
        component: OpportunityIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'index',
        component: OpportunityIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'kanban',
        component: OpportunitiesKanbanComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'view/:id',
        component: OpportunityFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: '/:id',
        component: OpportunityFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'create',
        component: OpportunityFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: 'update/:id',
        component: OpportunityFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'contacts',
    children: [
      {
        path: '',
        component: ContactIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'index',
        component: ContactIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'view/:id',
        component: ContactFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'create',
        component: ContactFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: 'update/:id',
        component: ContactFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'companies',
    children: [
      {
        path: '',
        component: CompanyIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'index',
        component: CompanyIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'view/:id',
        component: CompanyFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'create',
        component: CompanyFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: 'update/:id',
        component: CompanyFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessOppRouting { }
