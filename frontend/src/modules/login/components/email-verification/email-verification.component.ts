import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PasswordAndVerificationService } from '../../services/password-and-verification.service';


@Component({
    selector: 'email-verification-root',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.css']
})

export class EmailVerificationComponent implements OnInit {

    public errorMsg: string = ''
    //This line describes verification in process if fails or done this message will be changed
    //TODO: low (These message will go to constants)
    public description: string = 'Verification in process...';

    constructor(private route: ActivatedRoute, private router: Router,
        private _verificationService: PasswordAndVerificationService, public snackBar: MatSnackBar) { }
    ngOnInit() {

        this.route.queryParams.subscribe(
            params => {
                console.log(params['confirmation_token']);
                
                //Sucess process will take to reset password for change password
                this._verificationService.verifyUser(params['confirmation_token']).subscribe((result) => {
                    if (result) {
                        console.log('--on component');
                        console.log(result);

                        this.snackBar.open('Confirmation Token has been accepted..', "Sucesss", {
                            duration: 1000,
                        }).afterDismissed().subscribe(() => {
                            //redirecting to user
                           this.router.navigate(['auth/reset-password'], { queryParams: { password_reset_token: result['password_reset_token'] } })
                        });
                        
                    }
                }, error => {
                    this.errorMsg = error.body;
                    this.description = '';

                    this.snackBar.open(this.errorMsg, "Error", {
                        duration: 1000,
                    }).afterDismissed().subscribe(() => {
                        //redirecting to user
                        this.router.navigate(['/auth/forgot-password']);
                    });
                });
            });
    }
}