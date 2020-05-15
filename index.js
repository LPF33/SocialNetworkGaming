const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const csurf = require("csurf");
const register = require('./router/register.js');
const login = require('./router/login.js');
const resetpassword = require('./router/resetpassword.js');
const App = require('./router/app.js');
const database = require("./database.js");


app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));

const cookieSessionMiddleware = cookieSession({
    secret: "All I wanna do is coding games",
    maxAge: 1000 * 60 * 60 * 24
});
app.use( cookieSessionMiddleware);

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async function(socket){
    const userId = socket.request.session.userId;

    if(userId){
        await database.socketIdUser(userId, socket.id);
    }
    
    if(!socket.request.session.userId){
        console.log("User disconnected");
        io.sockets.sockets[socket.id].broadcast.emit("useronline");
        await database.deleteSocket(userId);
        return socket.disconnect(true);
    }
    
    const messageHistory = await database.getChatHistory();
    const userProfile = await database.getUserWithId(userId);

    io.sockets.sockets[socket.id].broadcast.emit("useronline");

    socket.emit("chatMessages", {
        data : messageHistory.rows
    });

    socket.on("chatMessage", async(data) => {
        const messageData = await database.storeChatMessage(userId,data);        
        
        io.sockets.emit("chatMessage",{
            chat_id : messageData.rows[0].id,
            message_text : messageData.rows[0].message_text,
            ...userProfile.rows[0]
        });
    });

    socket.on("chatInvitation", async(otherUserId) => {
        const searchSocketId = await database.getSocketId(otherUserId);
        const socketId = searchSocketId.rows[0].socket_id;
        const host = await database.getUserWithId(userId);
        const room = userId+"room"+otherUserId;
        socket.join(room); 
        io.sockets.sockets[socketId].emit("chatInvitation", {
            message:"You got an invitation to chat",
            room,
            host: host.rows[0],
            accept: false,
            decline: false
        });
    });

    socket.on("acceptChat", async(data) => {
        const searchSocketId = await database.getSocketId(data.host);
        const socketId = searchSocketId.rows[0].socket_id;
        const host = await database.getUserWithId(userId);
        socket.join(data.room); 
        io.sockets.sockets[socketId].emit("acceptChatInvitation", {
            message:"Your chat invitation was accepted",
            room: data.room,
            host: host.rows[0],
            accept: true,
            decline: false
        });
    });

    socket.on("declineChat", async(data) => {
        io.to(data.room).emit("acceptChatInvitation",{
            message:"Your chat invitation was declined",
            room: data.room,
            host: {firstname : data.firstname},
            decline: true
        });
    });

    socket.on("singleChatMessage", data => { 
        io.to(data.room).emit("singleChatMessage",data);
    });

    socket.on("gameInvitation", async(id) => {
        const searchSocketId = await database.getSocketId(id);
        const socketId = searchSocketId.rows[0].socket_id;
        const host = await database.getUserWithId(userId);
        const room = socket.id+"room";
        socket.join(room); console.log(userId +"send to "+id);
        io.sockets.sockets[socketId].emit("gameInvitation", {
            message:"You got an invitation to play a Game",
            room,
            host: host.rows[0]
        });
    });   


});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use('/public', express.static('public'));
app.use('/games', express.static('games'));
app.use(register);
app.use(login);
app.use(resetpassword);
app.use(App);

app.get("/welcome", (request, response) => {
    if(request.session.userId){
        response.redirect("/");
    } else {
        response.sendFile(__dirname + '/index.html');
    }
});

app.get("*", function(request, response) {
    if(request.session.userId){
        response.sendFile(__dirname + '/index.html');
    } else {
        response.redirect("/welcome");
    }    
});

server.listen(process.env.PORT || 8080);
