import mongoose = require("mongoose");
import UserModel = require("./../../../model/UserModel");

class SchemaValidation {



    static validateEmail(ob, schema) {



        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(ob.user_id);
    }

    static unique() {

        var model = new UserModel();

        return model.findByAttribute({ email: 'asdlfjlskdjf' });
        // return _model.find({ user_id: "aligenius2013@gmail.com" }, function (err, user) {
        //     console.log(user)
        // });
    }

}

export = SchemaValidation;    