
const express = require("express");

const app = express();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
// const multer = require('multer'),
bodyParser = require('body-parser')
path = require('path');
const mongoose = require("mongoose");

mongoose.connect("YOUR MONGODB URI",function(error){
    if(error) console.log("mongoose connection error: ", error);
    console.log("mongoose connection successful");
})
// let db = mongoose.connection
// const fs = require('fs');
let user = require("./models/User");
// const {log} = require("nodemon/lib/utils");

let port = process.env.PORT || 2000

app.listen(port, () => {
    console.log('Server is Running On port: '+port);
    // if(mongoose.connection){
    //     console.log("mongoose mongoose mongoose")
    // }
    // else{
    //     console.log("no mongoose")
    // }
});
app.use(cors());
// app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));

app.get('/saveScore/:score/:playerName', function(req, res,next) {
    console.log("saveScore get")
    let playerName = req.params.playerName.replace(/^\s+|\s+$/gm,'')
    const query = {"username": playerName};
    const update = {
        "$set": {
            "score": parseInt(req.params.score)
        }
    };
    const options = {returnNewDocument: true};// Return the updated document instead of the original document

    user.find({ "username": playerName }, (err, data) => {
        if(req.params.score > data[0].score){
             user.findOneAndUpdate(query, update, options)
                 .then(() =>
                     user.find((error, data)=> {
                         if (error) {
                             return next(error)
                         } else {
                             res.json(data)
                             // console.log(data.length)
                         }
                     }).sort({"score": -1})
                 )
                // .then(updatedDocument => {
                //     user.find((error, data) => {
                //         if (error) {
                //             return next(error)
                //         } else {
                //             res.json(data)
                //         }
                //     })
                    // if (updatedDocument) {
                    //     console.log(`Successfully updated score: ${updatedDocument}.`)
                    // } else {
                    //     console.log("No document matches the provided query - score.")
                    // }
                //     return updatedDocument
                // })
                .catch(err => console.error(`Failed to find and update document: ${err}`))
        }
    });

})
app.get('/showAll', function(req, res,next) {
    console.log("showAll get")

    user.find((error, data)=> {
        if (error) {
            return next(error)
        } else {
            res.json(data)
            // console.log(data.length)
        }
    }).sort({"score": -1})
})
app.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        title: 'Apis'
    });
});
// app.post("/test", (req, res) => {
//     console.log("test")
// });
app.post("/logOut", (req, res) => {
    console.log("logOut post")

    const query = { "username": "Sagi148" };

    const update = {
        "$set": {
            "loggedIn": false
        }
    };
// Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return user.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {
            // if(updatedDocument) {
            //     console.log(`Successfully updated loggedIn to false: ${updatedDocument}.`)
            // } else {
            //     console.log("No document matches the provided query - loggedIn to false.")
            // }
            return updatedDocument
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
});
app.post("/logOutEveryOne", (req, res) => {
    console.log("logOutEveryOne post")
    const query = { "loggedIn": true };

    const update = {
        "$set": {
            "loggedIn": false
        }
    };
// Return the updated document instead of the original document
    const options = { returnNewDocument: true };

    return user.updateMany(query, update,options)
        .then(updatedDocument => {
            // if(updatedDocument) {
            //     console.log(`Successfully updated all users loggedIn to false: ${updatedDocument}.`)
            // } else {
            //     console.log("No document matches the provided query - all users loggedIn to false.")
            // }
            return updatedDocument
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
});
/* register api */
app.post("/register", (req, res) => {
    console.log("register post")
    try {
        let userName=req.body.username.replace(/^\s+|\s+$/gm,'');
        if (req.body && userName) {
            let currentDate = new Date().toLocaleString('en-GB');
            user.find({ username: userName }, (err, data) => {
                if (data.length === 0) {

                    let User = new user({
                        username: userName,
                        loggedIn: true,
                        date:currentDate
                    });
                    User.save((err) => {
                        if (err) {
                            res.status(400).json({
                                errorMessage: err,
                                status: false
                            });
                        } else {
                            res.status(200).json({
                                status: true,
                                title: 'Registered Successfully.',
                            });
                        }
                    })
                } else {


                    // console.log("data2: "+ data )
                    // res.status(400).json({
                    //     errorMessage: `UserName ${userName} Already Exist!`,
                    //     status: false
                    // });
                    res.status(200).json({
                        status: true,
                        title: `Welcome back ${userName}`,
                    });
                    const query = { "username": userName };

                    const update = {
                        "$set": {
                            "loggedIn": true,
                            "date":currentDate
                        }
                    };
// Return the updated document instead of the original document
                    const options = { returnNewDocument: true };
                    return user.findOneAndUpdate(query, update, options)
                        .then(updatedDocument => {
                            // if(updatedDocument) {
                            //     console.log(`Successfully updated loggedIn to true & date to current date: ${updatedDocument}.`)
                            // } else {
                            //     console.log("No document matches the provided query - loggedIn to true & date to current date.")
                            // }
                            return updatedDocument
                        })
                        .catch(err => console.error(`Failed to find and update document: ${err}`))
                }

            });

        } else {
            res.status(400).json({
                errorMessage: 'The name field is empty, please enter your name first.',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong with the registration!',
            status: false
        });
    }
});
/* login api */
app.post("/login", (req, res) => {
    console.log("login post")
    try {
        let userName=req.body.username.replace(/^\s+|\s+$/gm,'');
        if (req.body && userName) {
            user.find({ username: userName }, (err, data) => {
                if (data.length > 0) {

                } else {
                    res.status(400).json({
                        errorMessage: 'Username is incorrect!',
                        status: false
                    });
                }
            })
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }

});
