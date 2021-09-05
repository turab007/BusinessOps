import { NgModule } from '@angular/core';
import { PageActions } from 'modules/app';
import {
  Routes,
  RouterModule
} from '@angular/router';


import {
  RoleIndexComponent, RoleFormComponent, RoleViewComponent,
  UserFormComponent, UserViewComponent, UserIndexComponent,
  ChangePasswordComponent, ProfileFormComponent,
  BusinessGroupFormComponent, BusinessGroupIndexComponent,
  TagFormComponent, TagIndexComponent,
  ReleaseIndexComponent, ReleaseFormComponent,
  MailServerIndexComponent, MailServerFormComponent,MailServerTestComponent,
  ManagePermissionsComponent
} from './';

const routes: Routes = [
  {
    path: '',
    component: RoleIndexComponent,
    data: {
      title: 'List all'
    }
  },
  {
    path: 'roles',
    children: [
      {
        path: '',
        component: RoleIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'view/:id',
        component: RoleFormComponent,
        data: {
          title: 'View',
          action: "view"//PageActions.view
        }
      },
      {
        path: 'create',
        component: RoleFormComponent,
        data: {
          title: 'Add New',
          action: "create"//PageActions.create
        }
      },
      {
        path: 'update/:id',
        component: RoleFormComponent,
        data: {
          title: 'Update',
          action: "update"//PageActions.update
        }
      }
    ]
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserIndexComponent,
        data: {
          title: 'User::List all'
        }
      },
      {
        path: 'create',
        component: UserFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: ':id',
        component: UserFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'view/:id',
        component: UserFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'update/:id',
        component: UserFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'business-groups',
    children: [
      {
        path: '',
        component: BusinessGroupIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'create',
        component: BusinessGroupFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: 'view/:id',
        component: BusinessGroupFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: ':id',
        component: BusinessGroupFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },

      {
        path: 'update/:id',
        component: BusinessGroupFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'tags',
    children: [
      {
        path: '',
        component: TagIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'create',
        component: TagFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: ':id',
        component: TagFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'view/:id',
        component: TagFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'update/:id',
        component: TagFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path: 'mail-servers',
    children: [
      {
        path: '',
        component: MailServerIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'test-mail',
        component: MailServerTestComponent,
        data: {
          title: 'Mail Configuration Test',
          action: 'test'
        }
      },
      {
        path: 'create',
        component: MailServerFormComponent,
        data: {
          title: 'Add Configuration',
          action: 'create'
        }
      },
      {
        path: ':id',
        component: MailServerFormComponent,
        data: {
          title: 'View Configuration',
          action: 'view'
        }
      },
      {
        path: 'view/:id',
        component: MailServerFormComponent,
        data: {
          title: 'View Configuration',
          action: 'view'
        }
      },
      {
        path: 'update/:id',
        component: MailServerFormComponent,
        data: {
          title: 'Update Configuration',
          action: 'update'
        }
      },
      {
        path: 'test-mail/:id',
        component: MailServerTestComponent,
        data: {
          title: 'Mail Configuration Test',
          action: 'test'
        }
      },
      
    ]
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        component: ProfileFormComponent,
        data: {
          title: 'Profile',
          action: 'view'
        }
      },
      {
        path: 'update',
        component: ProfileFormComponent,
        data: {
          title: 'Update User',
          action: 'update'
        }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password',
          action: 'change_password'
        }
      }
    ]
  },
  {
    path: 'releases',
    children: [
      {
        path: '',
        component: ReleaseIndexComponent,
        data: {
          title: 'List all'
        }
      },
      {
        path: 'create',
        component: ReleaseFormComponent,
        data: {
          title: 'Add New',
          action: 'create'
        }
      },
      {
        path: ':id',
        component: ReleaseFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'view/:id',
        component: ReleaseFormComponent,
        data: {
          title: 'View',
          action: 'view'
        }
      },
      {
        path: 'update/:id',
        component: ReleaseFormComponent,
        data: {
          title: 'Update',
          action: 'update'
        }
      }
    ]
  },
  {
    path:'permissions',
    component:ManagePermissionsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRouting { }
