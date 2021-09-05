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
var User = require('../models/user');

// User.createUser({
//     email: 'mianmitho@gmail.com',
//     firstName: 'Mohsin',
//     lastName: 'Shoaib',
// })

User({
    email: 'mianmitho@gmail.com',
    firstName: 'Mohsin',
    lastName: 'Shoaib',
}).save(function (err, newUser) {
    if (err) throw err;
    console.log('User created!');
});
// var User = require('../server/models/user');

// let findUserPromise = new Promise((resolve, reject) => {
//     User.find({ email: 'admin@site.com' }, function (err, user) {
//         if (err) throw err;
//         console.log('first promise');
//         resolve(user);
//     });
// });

// findUserPromise.then((user) => {
//     console.log('additional then');
// })

// secondPromise = findUserPromise.then((user) => {
//     return new Promise(function (resolve, reject) {
//         console.log("Second Promise")
//         if (user == false) {
//             // create default user
//             User({
//                 fullname: 'Mohsin Shoaib',
//                 email: 'admin@site.com',
//                 password: 'pass2word',
//             }).save(function (err, newUser) {
//                 if (err) throw err;
//                 console.log('User created!');
//                 resolve(newUser);
//             });
//         }
//         else
//         {
//             resolve(user);
//         }
//     });

// });

// secondPromise.then((user) => {
//     console.log("User is created (or already exists). Its id is " + user.id);
//     mongoose.connection.close()
// });

// console.log("End of line");
// // mongoose.connection.close()