import nodemailer = require('nodemailer');
import { MailServerModel} from "../model/barrel/"
const EMAIL_ACCOUNT_USER = 'testservice2015@gmail.com';
const EMAIL_ACCOUNT_PASSWORD = 'abc123AB@'

/**
 * This class is a wrapper on nodemailer 
 */
class SystemEmailer {
    private transporter;
    /**
     *  Create the transporter object
     */
    constructor() {

    }

    public getConf() {
        return new MailServerModel().findByAttribute({}).then(res => {

            if (res.is_gmail) {

                this.transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        //TODO:Low take these constants to Configuration
                        user: res.user_name, // Your email id (TODO)
                        pass: res.password // Your password
                    }
                });
            }
            else {
                //For norml convention
                this.transporter = nodemailer.createTransport({
                    host: res.host,
                    port: res.port,
                    secure: true, // secure:true for port 465, secure:false for port 587
                    auth: {
                        user: res.user_name, // Your email id (TODO)
                        pass: res.password // Your password
                    }
                });

            }
            // console.log(this.transporter);
            return this;
        })
    }
    /**
     * This function for email sending  it has mailOptions which is Object,
     * inside html and text results is a variable that used 
     * @param mailOptions 
     *      mailOptions = {
                from: 'sender@example.com',
                to: 'receiver@example.com',
                subject: 'Subject Request',
                html: results.html
                text: results.text
            }
     */
    send(mailOptions: Object) {
        // this.transporter.sendMail(mailOptions, function (err, responseStatus) {
        //     if (err) {
        //         console.error(err);
        //         //res.end('error');
        //     } else {
        //         console.log(responseStatus.message);
        //         //res.end('sent');
        //     }
        // });
        return this.transporter.sendMail(mailOptions);
    }
}

export =  SystemEmailer;