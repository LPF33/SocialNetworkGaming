const express = require("express");
const register = express.Router();

const database = require("../database.js");
const hashP = require("../password.js");

register.post("/register", (request, response) => {
    const {firstname, lastname, email, password} = request.body;
    if(!firstname || !lastname || !email || !password){
        response.json({
            success: false,
            error: "Please fill out all fields."
        });
    } else {
        hashP.hash(password).then( hash => {
            database.addUser(firstname, lastname, email, hash)
                .then( result => {
                    request.session.userId = result.rows[0].id;
                    response.json({
                        "success": true
                    });
                })
                .catch( () => {
                    response.json({
                        success: false,
                        error: "Please use a different email address"
                    });
                });
        }).catch( () => {
            response.json({
                success: false,
                error: "Something went wrong"
            });
        });
    }  
});

module.exports = register;