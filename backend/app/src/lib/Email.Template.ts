import emailTemplates = require('email-templates');
import path = require("path");
import fs = require("fs");

class SystemEmailTemplate {
    private template;
    private templatesDir;

    /**
     *  
     * @param templateName 
     *      e.g templateName = 'contact-request'
     */
    constructor(templateName:string) {
        this.templatesDir = path.resolve(`${__dirname}/../views/templates/`);
        console.log(fs.realpathSync(this.templatesDir));
        this.template = new emailTemplates.EmailTemplate(path.join(this.templatesDir, templateName));
    }
    /**
     * 
     * @param locals 
     *  e.g  { message: "Hello World",model:User.find };
     */
    public render(locals:Object){
         return this.template.render(locals);
    }
}

export = SystemEmailTemplate;