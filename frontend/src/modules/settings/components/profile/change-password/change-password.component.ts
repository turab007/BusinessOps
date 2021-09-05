import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { FormValidator } from './../../../validators/form-validator'
import { FormHelper } from './../../../../shared/helpers/form.helper'
import { ChangePassword } from './../../../view-models/change-password';
import { FormError } from './../../../view-models/form-error';
import { ProfileService } from './../../../services/profile.service';


@Component({
    selector: 'change-password-page',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {
    public formHelper: FormHelper
    public changePasswordForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private changePassword: ChangePassword;
    public pageTitle: string
    public componentLables = { 'old_password': 'Old Password', 'new_password': 'New Password', 'confirm_new_password': 'Confirm New Password' }

    constructor(
        private _fb: FormBuilder, private _profileService: ProfileService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar) {

    } // form builder simplify form initialization

    ngOnInit() {
        try {

            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.changePasswordForm = this._fb.group({
                old_password: ['', [<any>Validators.required, <any>Validators.minLength(7)]],
                new_password: ['', [<any>Validators.required, <any>Validators.minLength(7)]],
                confirm_new_password: ['', [<any>Validators.required, <any>Validators.minLength(7)]],
            }, { validator: FormValidator.passwordAndConfirmPassword.bind(this._profileService) });

            //set form helper
            this.formHelper = new FormHelper(this.changePasswordForm, this.componentLables);

        }
        catch (e) {
            console.log(e);
        }

    }




    save(model: ChangePassword, isValid: boolean) {
        this.submitted = true;

        if (isValid) {


            this._profileService.changePassword(model).subscribe(resp => {

                this.snackBar.open("Password has been Changed successfully", "Profile", {
                    duration: 2000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this.router.navigate(['/settings/profile']);
                });

            }, error => {

                this.formHelper.handleSubmitError(error);
            })
        }
    }


}