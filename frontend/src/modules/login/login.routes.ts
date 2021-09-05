import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login-form/login.component'
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordFormComponent,
    data: {
      title: 'Forgot Password'
    }
  },
  {
    path: 'verification',
    component: EmailVerificationComponent,
    data: {
      title: 'Email Verification'
    }
  }
  ,
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    data: {
      title: 'Reset Password'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
