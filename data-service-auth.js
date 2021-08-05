const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({ 
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent":String
    }]
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://dbUser:Ackerly1@web322.aasgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password == userData.password2) {
            bcrypt.genSalt(10) // Generate a "salt" using 10 rounds
            .then(salt=>bcrypt.hash(userData.password,salt)) // encrypt the password: "myPassword123"
            .then(hash=>{
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("User name already taken"); return;
                        }
                        else if (err.code != 11000) {
                            reject(`There was an error creating the user ${userData}`); return;
                        }
                    } 
                resolve();  
                });
            })
            .catch(err=>{
                reject(`There was an error encrypting the password`); return; // Show any errors that occurred during the process
            });
        }
        else {
            reject("Passwords do not match"); return;
        }
    })
};

module.exports.checkUser = function (userData) {
    return new Promise(function(resolve,reject) {
        User.find({ userName: userData.userName })
        .exec()
        .then((users) => {
            if (users.length == 0) {
                reject(`Unable to find user: ${userData.userName}`); return;
            }
            bcrypt.compare(userData.password, users[0].password).then((result) => {
                if (result === false) {
                    reject(`Incorrect Password for user: ${userData.userName}`); return;
                }
                else if (result === true) {
                    users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.updateOne(
                        {userName: users[0].userName},
                        {$set: {loginHistory: users[0].loginHistory}}
                    ).exec().catch(() => {
                        reject(`There was an error verifying the user: ${userData}`); return;
                    })
                    resolve(users[0]);
                }
            });
        }).catch ((err) => {
            console.log(err);
            reject(`There was an error verifying the user: ${userData.userName}`); return;
        });
    })
};
