const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const user = require("./models/User");
bodyParser = require('body-parser');
mongoose.connect("YOUR MONGODB URI.cfrv5.mongodb.net/quizUsers?retryWrites=true&w=majority",
    function(error){
    if(error) console.log("mongoose connection error: ", error);
    console.log("mongoose connection successful");
})

let port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        title: 'Server is running.'
    });
});

app.get("/register", (req, res) => {
    console.log("register get")
    res.status(200).json({
        status: true,
        title: '/register'
    });
});

/* register api */
app.post("/register", (req, res) => {
    console.log("register post")


    try {
        //Removes white spaces from the beginning and the end.
        let currentUserName=req.body.username.replace(/^\s+|\s+$/gm,'');
        //If user name input not empty.
        if (currentUserName) {
            //Current date in format: DD/MM/YYYY HH:MM:SS
            let currentDate = new Date().toLocaleString('en-GB');
            user.find({ username: currentUserName }, (err, data) => {
                if (data.length === 0) {//New user.
                    //Create new user.
                    let User = new user({
                        username: currentUserName,
                        loggedIn: true,
                        date:currentDate
                    });
                    //Save in the data base.
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
                    res.status(400).json({
                        errorMessage: `The user name: ${currentUserName} already exist!`,
                        status: false
                    });
                    const query = { "username": currentUserName };

                    const update = {
                        "$set": {
                            "loggedIn": true,
                            "date":currentDate
                        }
                    };
// Return the updated document instead of the original document
                    const options = { returnNewDocument: true };
                    return user.findOneAndUpdate(query, update, options)
                        // .then(updatedDocument => {
                        //     if(updatedDocument) {
                        //         console.log(`Successfully updated loggedIn to true & date to current date: ${updatedDocument}.`)
                        //     } else {
                        //         console.log("No document matches the provided query - loggedIn to true & date to current date.")
                        //     }
                        //     return updatedDocument
                        // })
                        .catch(err => console.error(`Failed to find and update document: ${err}`))
                }

            });

        } else {
            res.status(400).json({
                errorMessage: 'The name field is empty, please enter your name.',
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

app.get('/saveScore/:score/:playerName', function(req, res) {
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
             user.findOneAndUpdate(query, update, options).sort({"score": -1})
                // .then(updatedDocument => {
                //     user.find((error, data) => {
                //         if (error) {
                //             return next(error)
                //         } else {
                //             res.json(data)
                //         }
                //     })
                //     if (updatedDocument) {
                //         console.log(`Successfully updated score: ${updatedDocument}.`)
                //     } else {
                //         console.log("No document matches the provided query - score.")
                //     }
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
        }
    }).sort({"score": -1})
})

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

/* login api */
// app.post("/login", (req, res) => {
//     console.log("login post")
//     try {
//         let userName=req.body.username.replace(/^\s+|\s+$/gm,'');
//         if (req.body && userName) {
//             user.find({ username: userName }, (err, data) => {
//                 if (data.length > 0) {
//
//                 } else {
//                     res.status(400).json({
//                         errorMessage: 'Username is incorrect!',
//                         status: false
//                     });
//                 }
//             })
//         } else {
//             res.status(400).json({
//                 errorMessage: 'Add proper parameter first!',
//                 status: false
//             });
//         }
//     } catch (e) {
//         res.status(400).json({
//             errorMessage: 'Something went wrong!',
//             status: false
//         });
//     }
//
// });
