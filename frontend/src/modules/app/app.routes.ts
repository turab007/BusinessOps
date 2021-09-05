import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PageComponent, SimpleLayoutComponent, FullLayoutComponent } from '../layout/';
import { GitHubCallbackComponent } from './components/gitHub-callback.component/gitHub-callback.component'
import { GitLabCallbackComponent } from './components/gitLab-callback/gitLab-callback.component';

// Services
import { CanActivateViaAuthGuard } from './services';

// Import modules routes
import { } from '../base';


// Routes
export const appRoutes: Routes = [

  {
    path: 'auth',
    component: SimpleLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: '../login/login.module#LoginModule'
      }
    ]
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        loadChildren: '../dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule'
      },
    ]
  },
  {
    path: 'settings',
    component: PageComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        loadChildren: '../settings/settings.module#SettingsModule'
      },
      {
        path: 'settings',
        loadChildren: '../settings/settings.module#SettingsModule'
      },
    ]
  },
  {
    path: 'business-opps',
    component: PageComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        loadChildren: '../business-opps/business-opps.module#BusinessOppModule'
      },
      {
        path: 'business-opps',
        loadChildren: '../business-opps/business-opps.module#BusinessOppModule'
      },

    ]
  },
  {
    path: 'workspace',
    component: PageComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        loadChildren: '../workspace/workspace.module#WorkspaceModule'
      }
    ]
  },
  {
    path: 'employee',
    component: FullLayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: '',
        loadChildren: '../employee/employee.module#EmployeeModule'
      }
    ]
    // children: [
    //   {
    //     path: '',
    //     loadChildren: '../employee/employee.module#EmployeeModule'
    //   }
    // ]
  },
  {
    path: 'githubcallback',
    component: GitHubCallbackComponent
  },
  {
    path: 'gitlabcallback',
    component: GitLabCallbackComponent
  }
  // LoginRoute,
  // {
  //   path: '',
  //   component: PageComponent,
  //   canActivate: [CanActivateViaAuthGuard],
  //   children: []
  //     .concat(BaseRoutes)
  //     .concat(BaseRoutes2)
  // }
  // {
  //   path: '',
  //   component: PageComponent,
  //   canActivate: [CanActivateViaAuthGuard],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: DashboardComponent
  //     },
  //     {
  //       path: 'users',
  //       component: UsersComponent
  //     }
  //   ]
  // }

  // LoginRoute,
  // {
  //   path: '',
  //   component: PageComponent,
  //   canActivate: [CanActivateViaAuthGuard],
  //   children: []
  //     .concat(BaseRoutes)
  //     .concat(BaseRoutes2)
  // }
];