const express = require("express");
const resetpassword = express.Router();

const database = require("../database.js");
const hashP = require("../password.js");
const ses = require("../ses");

const cryptoRandomString = require('crypto-random-string');


resetpassword.post("/password/reset", (request, response) => {
    const {email} = request.body;
    if(!email){
        response.json({
            success: false,
            error: "Please fill out the email field."
        });
    } else {
        database.getUser(email)
            .then(result => {
                if(result.rows.length>0){
                    const secretCode = cryptoRandomString({
                        length: 8
                    });
                    database.insertCode(email,secretCode)
                        .then( () => {
                            ses.sendResetMail(email,secretCode)
                                .then( result => { 
                                    response.json({
                                        "success": true
                                    });
                                })
                                .catch(error => response.json({
                                    success: false,
                                    error: "Couldn't send an email!"
                                }));
                        })
                        .catch( error => console.log(error));
                } else {
                    response.json({
                        success: false,
                        error: "Nothing found"
                    });
                }
            })
            .catch( error => {
                response.json({
                    success: false,
                    error: "Something went wrong"
                });
            });            
    }
});

resetpassword.post("/password/reset/verify", (request, response) => {
    const {email, code, password} = request.body;
    database.checkCode(email)
        .then( result => { 
            if(result.rows[0].code === code) {
                hashP.hash(password)
                    .then( hash => {
                        database.updatePassword(email, hash)
                            .then( () => {
                                response.json({
                                    "success": true
                                });
                            })
                            .catch( error => {
                                response.json({
                                    success: false,
                                    error: "Something went wrong"
                                });
                            }); 
                    })
                    .catch( error => {
                        response.json({
                            success: false,
                            error: "Something went wrong"
                        });
                    }); 
            } else {
                response.json({
                    success: false,
                    error: "Your code is wrong. Try it again!"
                });
            }
        })
        .catch( error => {
            response.json({
                success: false,
                error: "Something went wrong"
            });
        }); 
});


module.exports = resetpassword;