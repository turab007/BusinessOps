import 'hammerjs';
// Import Core/Required Components
import { NgModule, Type } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// (optional) Additional Covalent Modules imports
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
// import { CovalentHighlightModule } from '@covalent/highlight';
// import { CovalentMarkdownModule } from '@covalent/markdown';
// import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';



import { LoginService } from '../login/services/login.service'
import { PasswordAndVerificationService } from '../login/services/password-and-verification.service'
import { AppComponent } from './';
import { CanActivateViaAuthGuard } from './services';
// Import routes
import { appRoutes } from './app.routes';

import { APP_ALL_MODULES } from '../module.barrel';
import { PageComponent,FullLayoutComponent } from '../layout';

import { RequestInterceptor } from '../../config/interceptors/request.interceptor';

import {GitHubCallbackComponent} from './components/gitHub-callback.component/gitHub-callback.component';
import {GitLabCallbackComponent} from './components/gitLab-callback/gitLab-callback.component';

const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

@NgModule({
  imports: [
    // LayoutModule,
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: RequestInterceptor, paths: ['**'],
      }],
    }),

    // MaterialModule.forRoot(),
    BrowserAnimationsModule,
    APP_ALL_MODULES
  ],
  declarations: [
    AppComponent,
    GitHubCallbackComponent,
    GitLabCallbackComponent
    // APP_COMPONENTS
  ],
  entryComponents: [],
  bootstrap: [
    AppComponent,
  ],
  providers: [
    httpInterceptorProviders,
    Title,
    CanActivateViaAuthGuard,
    LoginService, // TODO:low (take this to module level)
    PasswordAndVerificationService // TODO:low (take this to module level)
    // APP_PROVIDERS
  ],

})
export class AppModule { }
