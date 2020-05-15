const express = require("express");
const login = express.Router();

const database = require("../database.js");
const hashP = require("../password.js");

login.post("/login", (request, response) => {
    const {email, password} = request.body;
    if(!email || !password){
        response.json({
            success: false,
            error: "Please fill out all fields."
        });
    } else {
        database.getUser(email)
            .then( user => { 
                hashP.compare(password, user.rows[0].password_hash)
                    .then( valid => { 
                        if(valid){
                            request.session.userId = user.rows[0].id;  
                            response.json({
                                "success": true
                            });                             
                        } else {
                            response.json({
                                success: false,
                                error: "Your email or password is not correct"
                            });
                        }

                    })
                    .catch( () => {
                        response.json({
                            success: false,
                            error: "Your email or password is not correct"
                        });
                    }); 
            })
            .catch( () => {
                response.json({
                    success: false,
                    error: "Your email or password is not correct"
                });
            }); 
    }  
});

module.exports = login;