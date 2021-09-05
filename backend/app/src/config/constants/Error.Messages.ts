/**
 * This class contais error messages.
 * 
 * Use it for sending customized errors. * i.e. return next(ErrorMessages.inValidEmail());
 * 
 * @class ErrorMessages
 */
class ErrorMessages {
    //define validation types
    static ValidationErrors = {
        REQUIRED: 'required',
        NOTVALID: 'notvalid',
        UNIQUE: 'unique',
        OLD_PASSWORD_NOT_MATCHED: 'old_password_not_matched', // ToDo:low (name can be changed)
        /* ... */
    };

    static errorHandler(err, next): any {
        console.log(err);
        return next(ErrorMessages.internalServerError());
    }


    /**
    * 40x Errors 
    */
    static invalidLogin() {
        return {
            error: true,
            message: "Invalid email or password.",
            status: 400
        }
    }

    static invalidToken() {
        return {
            error: true,
            message: "Invalid token or token has been expired.",
            status: 400
        }
    }

    static missingRequiredHeader() {
        return {
            error: true,
            message: "A required HTTP header was not specified.",
            status: 400
        }
    }
    static missingRequiredQueryParameter() {
        return {
            error: true,
            message: "A required query parameter was not specified for this request.",
            status: 400
        }
    }
    static invalidEmail() {
        return {
            error: true,
            message: "The given email address is not valid.",
            status: 400
        }
    }
    static invalidOldPassword() {
        return {
            error: true,
            message: [
                {
                    "old_password": "password does't not match with your existing password!",
                    "kind": "old_password_not_matched"
                }
            ],
            status: 400
        }
    }
    static invalidPassword() {
        return {
            error: true,
            message: "The given password is not valid.",
            status: 400
        }
    }
    static authenticationFail() {
        return {
            error: true,
            message: "The given email or password is not valid.",
            status: 400
        }
    }
    static unAuthorized() {
        return {
            error: true,
            message: "You are not authorized to access this.",
            status: 401
        }
    }
    static forbidden() {
        return {
            error: true,
            message: "You are forbidden to access this.",
            status: 403
        }
    }
    static accountIsDisabled() {
        return {
            error: true,
            message: "The specified account is disabled.",
            status: 403
        }
    }
    static accountAlreadyExists() {
        return {
            error: true,
            message: "The specified account already exists.",
            status: 409
        }
    }
    static resourceAlreadyExists() {
        return {
            error: true,
            message: "The specified resource already exists.",
            status: 409
        }
    }
    static notFound() {
        return {
            error: true,
            message: "The specified resource does not exist.",
            status: 404
        }
    }
    static inActiveUser() {
        return {
            error: true,
            message: "The specified user is Inactive.",
            status: 403
        }
    }

    /**
     * 50x Errors
     */
    static internalServerError() {
        return {
            error: true,
            message: "The server encountered an internal error. Please retry the request.",
            status: 500
        }
    }
    /**
     * TODO: low (Model validation rule will be compiled here)
     */
    static modelValidationMessages(error) {
        var errorMessages = [];
        for (let errName in error.errors) {
            console.log(errName);
            console.log(error.errors[errName].kind);
            switch (error.errors[errName].kind) {
                case ErrorMessages.ValidationErrors.REQUIRED:
                    var obj = {};
                    obj[errName] = `is required`;
                    obj['kind'] = error.errors[errName].kind;
                    errorMessages.push(obj);
                    break;
                case ErrorMessages.ValidationErrors.NOTVALID:
                    var obj = {};
                    obj[errName] = `is  not valid`;
                    obj['kind'] = error.errors[errName].kind;
                    errorMessages.push(obj);
                    break;
                case ErrorMessages.ValidationErrors.UNIQUE:
                    var obj = {};
                    obj[errName] = `already exists!`;
                    obj['kind'] = error.errors[errName].kind;
                    errorMessages.push(obj);
                    break;
                case ErrorMessages.ValidationErrors.OLD_PASSWORD_NOT_MATCHED:
                    var obj = {};
                    obj[errName] = `password does't not match with your existing password!`;
                    obj['kind'] = error.errors[errName].kind;
                    errorMessages.push(obj);
                    break;

            }
        }


        return errorMessages;

    }
    /**
     * 
     * @param requestBody 
     */
    static validateNewAndConfirmPassword(requestBody) {
        console.log(requestBody);
        if (!requestBody.new_password || !requestBody.confirm_new_password || !requestBody.password_reset_token) {
            return false
        }

        if (requestBody.new_password != requestBody.confirm_new_password) {
            return false;
        }

        return true;;
    }
}
Object.seal(ErrorMessages);
export = ErrorMessages;
