const express = require("express");
const App = express.Router();
const database = require("../database.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("../S3.js");

const profilePictureStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, __dirname + '/../uploads');
    },
    filename: function (request, file, callback) {
        if (!request.session.userId) {
            callback("No user session.", "");
        } else {
            uidSafe(8).then((uid) => {
                const userId = request.session.userId;
                const extension = path.extname(file.originalname);

                callback(null, `user_${userId}_${uid}${extension}`);
            });
        }
    },
});

const uploader = multer({
    storage: profilePictureStorage,
    limits: {
        fileSize: 4097152,
    },
});

App.get("/user", (request, response) => {
    database.getUserWithId(request.session.userId)
        .then( user => {
            response.json({
                user : user.rows[0]
            });
        })
        .catch(error => console.log(error));
});

App.post("/user/photo", uploader.single("file"), async(request, response) => {
    const photoUrl = s3.getBucketURL(request.file.filename);

    try {
        let user = await database.updatePhoto(request.session.userId, photoUrl);
        await s3.uploadToS3(request.file);        
        response.json({
            success: true,
            user: user.rows[0]
        });
    } catch (e){
        console.log(e);
    }
});

App.get("/user/photo/delete/:pictureFile", async(request, response) => {
    const {pictureFile} = request.params; 
    let user;
    try{
        await s3.deleteFromS3(pictureFile);
        user = await database.deletePhoto(request.session.userId);
    }catch(error){
        response.json({
            success: false
        });
    }    
    response.json({
        success: true,
        user: user.rows[0]
    });
});

App.get("/user/photoS3delete/:pictureFile", async(request, response) => {
    const {pictureFile} = request.params; 
    await s3.deleteFromS3(pictureFile);
    response.json({
        success: true
    });
});

App.post("/user/bio", (request, response) => { 
    database.addBio(request.session.userId, request.body.bio)
        .then( user =>
            response.json({
                success: true,
                user: user.rows[0]
            })
        );
});

App.get("/games/:gameid", (request,response) => {
    const gameId = parseInt(request.params.gameid);
    database.getGames(gameId)
        .then( games =>
            response.json({
                success: true,
                games: games.rows
            })
        );
});

App.get("/otheruser/:id", (request, response) => {
    database.getOtherUser(request.params.id)
        .then(otheruser => {
            if(otheruser){
                const myself = request.params.id == request.session.userId;
                response.json({success: true, otheruser:otheruser.rows[0], myself});
            }else {
                response.json({success: false});
            }
        })
        .catch(()=> {
            response.json({success: false});
        });
});

App.get("/users/", async (request, response) => { 
    const {search} = request.query;
    const result = await database.searchUsers(search); 
    response.json({
        success:true,
        users: result.rows
    });
});

const status_NoRequest = "no-request";
const status_Request_Accepted = "request-accepted";
const status_Request_MadeByOther = "request-made-by-other";
const status_Request_MadeByMe = "request-made-by-myself";

App.get("/checkfriendstatus/:otherUserId", async(request, response) => {
    const myUserId = request.session.userId;
    const {otherUserId} = request.params;

    const check = await database.checkFriendStatus(myUserId,otherUserId);

    if(check.rows.length === 0){
        response.json({
            status: status_NoRequest
        });
    } else if(check.rows[0].accepted){
        response.json({
            status: status_Request_Accepted
        });
    } else if(check.rows[0].from_id === myUserId ){
        response.json({
            status: status_Request_MadeByMe
        });
    } else {
        response.json({
            status: status_Request_MadeByOther
        });
    }    
});

App.post("/crudfriendstatus/:otherUserId/:status", async (request, response) => {
    const myUserId = request.session.userId; 
    const {status,otherUserId} = request.params;
    let newStatus;
    
    switch(status){
                    case status_NoRequest: await database.getMyFriend(myUserId,otherUserId); newStatus = status_Request_MadeByMe; break;
                    case status_Request_Accepted: await database.deleteFriends(myUserId,otherUserId); newStatus = status_NoRequest;break;
                    case status_Request_MadeByMe: await database.deleteFriends(myUserId,otherUserId); newStatus = status_NoRequest; break;
                    case status_Request_MadeByOther: await database.acceptFriends(myUserId,otherUserId); newStatus = status_Request_Accepted; break;        
    }

    response.json({
        status: newStatus
    });
});

App.get("/loadmyfriends", async (request, response) => {
    const myUserId = request.session.userId; 
    const friends = await database.loadFriends(myUserId); 
    response.json({
        friends: friends.rows
    });
});

App.post("/getallusersonline", async(request, response) => {   
    const userId = request.session.userId; 
    const allUsersOnline = await database.getAllUsersOnline(userId);
    response.json({
        allUsersOnline: allUsersOnline.rows
    });
});

App.post("/getallfriendssonline", async(request, response) => {    
    const userId = request.session.userId;
    const allFriendsOnline = await database.getAllFriendsOnline(userId);
    response.json({
        allFriendsOnline: allFriendsOnline.rows
    });
});

App.post("/edit/account", async (request, reponse) => {
    const {firstname, lastname} = request.body;
    const user = await database.changeAccount(request.session.userId, firstname, lastname);
    reponse.json({
        user: user.rows[0]
    });
});

App.get("/logout", async (request,response) => {
    const userId = request.session.userId;
    await database.deleteSocket(userId);
    request.session = null;
    response.redirect(302,"/welcome#/login");
});

App.get("/account/delete/:pictureFile", async (request, response) => {
    const userId = request.session.userId;
    try {
        if(request.params.pictureFile){
            const {pictureFile} = request.params; 
            await s3.deleteFromS3(pictureFile);
        }
        await database.deleteSocket(userId);
        await database.deleteUserChat(userId);
        await database.deleteFriendsFromUser(userId);
        await database.deleteUser(userId);
    }catch(error){
        console.log(error);
    }    
    request.session = null;
    console.log("All User data has been deleted!");
    response.redirect(302,"/welcome");
});

module.exports = App;