//Import the mongoose module
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Insert user
 */
var moduleModel = require('../models/module');

let createModule = new Promise((resolve, reject) => {
    moduleModel.find({ name: 'settings' }, function (err, module) {
        if (err) throw err;
        resolve(module);
    });
}).then((module) => {
    new Promise(function (resolve, reject) {
        if (module == false) {
            // create default user
            moduleModel({
                name: 'settings',
                status: true
            }).save(function (err, newModule) {
                if (err) throw err;
                console.log('User created!');
                resolve(newModule);
            });
        }
        else {
            resolve(module);
        }
    });
});

createModule.then((moduleResult) => {
    console.log(moduleResult);
})


// console.log("End of line");
// // mongoose.connection.close()