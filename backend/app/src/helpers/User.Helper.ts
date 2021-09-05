import IUserModel = require("./../model/interfaces/IUserModel");
import { IListModel }  from "./../model/interfaces/barrel";

import SystemEmailer = require("../lib/System.Emailer");
import SystemEmailTemplate = require("../lib/Email.Template");
import crypto = require("crypto");
import jsonwebtoken = require('jsonwebtoken');
import UserModel = require("./../model/UserModel");
/**
 * Helper functions will help some time generate small algorithims and used them in model and controllers
 * 
 */
export const generateActivationKey = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

export const generateResetPasswordToken = (): string => {
    return crypto.randomBytes(24).toString("hex");
};

export const sendConfirmationEmail = (user: IUserModel, originUrl: string) => {
    //Createing templates
    let email_template = new SystemEmailTemplate('confirmation-instructions');
    return email_template.render({ name: user.first_name, activation_token: user.activation_token, originUrl: originUrl }).then(resultTemplate => { // User as locals
        console.log(resultTemplate);

        //sending email
        return new SystemEmailer().getConf().then(email => {
            return email.send({
                from: 'sender@example.com',
                to: user.user_id,
                subject: 'Group Captain - Your account has been created',
                html: resultTemplate.html,
                text: resultTemplate.text
            }).then(resultEmail => {
                return resultEmail;
            }).catch(errorEmail => {
                return errorEmail;
            })
        })


    }).catch(errorTemplate => {

        return errorTemplate;
    });
};
export const sendResetPasswordEmail = (user: IUserModel, password_reset_token: string, originUrl: string) => {
    //Createing templates
    let email_template = new SystemEmailTemplate('reset-password-instructions');
    return email_template.render({ name: user.first_name, password_reset_token: password_reset_token, originUrl: originUrl }).then(resultTemplate => { // User as locals
        console.log(resultTemplate);

        //sending email
        return new SystemEmailer().getConf().then(email => {
            return email.send({
                from: 'sender@example.com',
                to: user.user_id,
                subject: 'Group Captain -  Reset password instructions',
                html: resultTemplate.html,
                text: resultTemplate.text
            }).then(resultEmail => {
                return resultEmail;
            }).catch(errorEmail => {
                return errorEmail;
            })
        })


    }).catch(errorTemplate => {

        return errorTemplate;
    });
};

export const shareList = (sender,list: IListModel, originUrl: string) => {
    //Createing templates
    let email_template = new SystemEmailTemplate('share-list');
    return email_template.render({ sender:sender, list:list, originUrl: originUrl }).then(resultTemplate => { // List as locals
        console.log(resultTemplate);

        //sending email
        return new SystemEmailer().getConf().then(email => {
            return email.send({
                from: 'no-reply@group-captain.com',
                to: list.shareEmail,
                subject: 'Group Captain -  List Sharing',
                html: resultTemplate.html,
                text: resultTemplate.text
            }).then(resultEmail => {
                return resultEmail;
            }).catch(errorEmail => {
                return errorEmail;
            })
        })


    }).catch(errorTemplate => {

        return errorTemplate;
    });
};

export const sendTestMail = (emailAddress: string, originUrl: string) => {
    //Createing templates
    let email_template = new SystemEmailTemplate('test');
    return email_template.render({ originUrl: originUrl }).then(resultTemplate => { // User as locals
        //sending email
        return new SystemEmailer().getConf().then(email => {

            return email.send({
                from: 'sender@example.com',
                to: emailAddress,
                subject: 'Group Captain - Test subject',
                html: resultTemplate.html,
                text: resultTemplate.text
            }).then(resultEmail => {
                return resultEmail;
            }).catch(errorEmail => {
                return errorEmail;
            })
        });


    }).catch(errorTemplate => {

        return errorTemplate;
    });
};
/**
* Get user payload from token
*/
export const getUserPayLoad = (token:string, model) => {
    var decoded = jsonwebtoken.decode(token.replace("Bearer ", ''), { complete: true });
    return model.findByEmail(decoded.payload.user_id)

};


export const random_bg_color = () => {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
}