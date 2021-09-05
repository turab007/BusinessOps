import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PasswordAndVerificationService } from '../../services/password-and-verification.service';
import { ResetPassword } from '../../viewmodels/reset-password.model';

@Component({
    selector: 'reset-password-form-root',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.css', '../../stylesheets/login-styles.css']
})

export class ResetPasswordFormComponent implements OnInit {

    public errorMsg: string = ''
    constructor(private route: ActivatedRoute, private router: Router,
        private _resetPasswordService: PasswordAndVerificationService, public snackBar: MatSnackBar) { }
    public model: ResetPassword;


    ngOnInit() {
        this.route.queryParams.subscribe(
            params => {
                console.log(params);
                this.verifyResetToken(params['password_reset_token']);

                this.model = {
                    new_password: '',
                    confirm_new_password: '',
                    password_reset_token: params['password_reset_token'],

                }
            });
    }
    /**
     * 
     * @param resetToken 
     */
    private verifyResetToken(resetToken: string) {

        this._resetPasswordService.verifyResetToken(resetToken).subscribe((result) => {
            if (!result) {
                this.errorMsg = "Invalid Token in request"; // TODO:low this message will go to constant
                this.showErrorSnackBar();
            }
        }, error => {
            this.errorMsg = error.body;
            this.showErrorSnackBar();
        });
    }
    onSubmit(model: ResetPassword, isValid: boolean, resetToken: string) {
        // call API to save password
        model.password_reset_token = resetToken;
        if (isValid) {
            console.log(model);
            this._resetPasswordService.resetPassword(model).subscribe((result) => {
                if (result) {
                    this.router.navigate(['dashboard']);
                }
            }, error => {
                this.errorMsg = error.body;
                console.log(error);


            });
        }
    }

    private showErrorSnackBar() {
        this.snackBar.open(this.errorMsg, "Error", {
            duration: 5000,
        }).afterDismissed().subscribe(() => {
            //redirecting to user
            this.router.navigate(['/auth/forgot-password']);
        });
    }
}