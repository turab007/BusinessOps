import {
    LoginComponent,
    ForgotPasswordFormComponent,
    EmailVerificationComponent,
    ResetPasswordFormComponent,
    LoginService,
    PasswordAndVerificationService,
    
} from './';

export const LOGIN_COMPONENTS = [
    LoginComponent,
    ForgotPasswordFormComponent,
    EmailVerificationComponent,
    ResetPasswordFormComponent
];

export const LOGIN_PROVIDERS = [
    LoginService,
    PasswordAndVerificationService
]