import { AbstractControl } from '@angular/forms';
import { UserService } from './../services/user.service';
import { BusinessGroupService } from 'modules/settings/';
import { User } from './../view-models/user';
export class FormValidator {
    /**
     * Password and confirm password match
     * @param control 
     */
    static passwordAndConfirmPassword(control: AbstractControl) {
        const new_password = control.get('new_password');
        const confirm_new_password = control.get('confirm_new_password');
        if (!new_password || !confirm_new_password) {
            return null;
        }
        return new_password.value === confirm_new_password.value ? null : confirm_new_password.setErrors({ nomatch: true });
    }
    /**
     * This method will check the given user email already exist or not , it will call the via service and observable will set
     * the validation error
     * 
     * @param group 
     * @param _userService 
     */
    static verifyUniqueEmail(group: AbstractControl, _userService: UserService, _id: string) {
        //TODO:low verify first email is valid or not
        let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // let control = group.get('user_id');
        let control = group;
        console.log('--validation--');

        if (EMAIL_REGEXP.test(control.value)) {
            let data = control.value;
            if (data != '' && control.valid) {
                let id: string = '';
                if (_id) {
                    id = _id;
                }

                return _userService.getByEmail(data, id).
                    subscribe(
                    user => {
                        if (user) {
                            control.setErrors({
                                "unique": true
                            });

                            return {
                                "unique": true
                            };
                        }
                    },
                    error => { }
                    );
            }
             return  {};
        }
        return  {};

    }
    /**
     * ToDo: High (Need implemenation)
     * @param control 
     * @param _businessGroupService 
     * @param _id 
     */
    static verifyUniqueBusinessGroup(control: AbstractControl, _businessGroupService: BusinessGroupService, _id: string) {
        let data = control.value;
        if (data != '' && control.valid) {
            let id: string = '';
            if (_id) {
                id = _id;
            }


        }

    }
}

