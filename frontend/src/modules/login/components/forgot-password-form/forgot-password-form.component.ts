import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService } from '@covalent/core';

import { PasswordAndVerificationService } from '../../services/password-and-verification.service';
import { ForgotPassword } from '../../viewmodels/forgot-password.model';

@Component({
    selector: 'forgot-password-root',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['./forgot-password-form.component.css','../../stylesheets/login-styles.css']
})

export class ForgotPasswordFormComponent implements OnInit {

    public model: ForgotPassword = new ForgotPassword();

    public errorMsg: string = '';
    //for overlay loading tracking 
    public overlayStarSyntax: boolean = false;

    constructor(private router: Router,
        private _forgotService: PasswordAndVerificationService,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService
    ) {
    }
    ngAfterViewInit() {
        // this.email.focus();
    }

    ngOnInit() {
    }

    onSubmit() {
        // this.router.navigate(['dashboard']);
        this.toggleOverlayStarSyntax();
        console.log(this.model.email);
        this._forgotService.forgotPassword(this.model.email).subscribe((result) => {

            if (result) {
                // this.router.navigate(['dashboard']);
                this.toggleOverlayStarSyntax();
                this.snackBar.open('Reset Token has been sent to your inbox..', "Sucesss", {
                    duration: 3000,
                }).afterDismissed().subscribe(() => {
                    this.router.navigate(['/auth/login']);
                });
            }
            else {
                this.showErrorMessage("Email delivery failed. Please try again!");
            }
        }, error => {
            this.toggleOverlayStarSyntax();
            this.errorMsg = error;
            this.showErrorMessage(this.errorMsg);
        });
    }
    /**
     * 
     * @param errorMsg 
     */
    private showErrorMessage(errorMsg: string): void {

        this.snackBar.open(this.errorMsg, "Error", {
            duration: 3000,
        }).afterDismissed().subscribe(() => {
            //redirecting to user
            this.router.navigate(['/auth/forgot-password']);
        });
    }
    /**
     * Set overlay toggle tracking
     */
    private toggleOverlayStarSyntax(): void {
        if (!this.overlayStarSyntax) {
            this._loadingService.register('overlayStarSyntax');
        } else {
            this._loadingService.resolve('overlayStarSyntax');
        }
        this.overlayStarSyntax = !this.overlayStarSyntax;
    }
}