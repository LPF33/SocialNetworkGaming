var spicedPg = require("spiced-pg");
var dbUrl = process.env.DATABASE_URL || "postgres:lars:lars@localhost:5432/games";
var db = spicedPg(dbUrl);

exports.addUser = (firstname, lastname, email, password_hash) => {
    return db.query('INSERT INTO users (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id;',
        [firstname, lastname, email, password_hash]
    );
};

exports.getUser = email => {
    return db.query('SELECT id, password_hash FROM users WHERE email = $1;',
        [email]
    );
};

exports.getUserWithId = id => {
    return db.query('SELECT * FROM users WHERE id = $1;',
        [id]
    );
};

exports.insertCode = (email, code) => {
    return db.query('INSERT INTO password_reset_codes (email, code) VALUES ($1,$2);',
        [email, code]);
};

exports.checkCode = email => {
    return db.query(`SELECT code FROM password_reset_codes 
                        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
                        AND email = $1 ORDER BY created_at DESC LIMIT 1;`,
    [''+email+'']);
};

exports.updatePassword = (email, hashpassword) => {
    return db.query('UPDATE users SET password_hash = $2 WHERE email = $1;',
        [email, hashpassword]);
};

exports.updatePhoto = (id, profile_picture_url) => {
    return db.query('UPDATE users SET profile_picture_url = $2 WHERE id = $1 RETURNING *;',
        [id, profile_picture_url]);
};

exports.deletePhoto = id => {
    return db.query(`UPDATE users SET profile_picture_url = '' WHERE id = $1 RETURNING *;`,
        [id]);
};

exports.getGames = gameId => {
    return db.query(`SELECT *, (SELECT id FROM games WHERE id = $1)AS previousGame,
                    (SELECT id FROM games WHERE id = $2) AS nextGame
                    FROM games where id > $1 ORDER BY id ASC LIMIT 3;`,
    [gameId - 2,gameId+2]);
};

exports.addBio = (id,bio) => {
    return db.query('UPDATE users SET bio = $2 WHERE id = $1 RETURNING *;',
        [id,bio]);
};

exports.getOtherUser = id => {
    return db.query('SELECT * FROM users WHERE id=$1;',
        [id]);
};

exports.searchUsers = search => {
    return db.query('SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1;',
        ['%'+search+'%']);
};


exports.checkFriendStatus = (myUserId, otherUserId) => {
    return db.query('SELECT * FROM getfriends WHERE (to_id = $1 AND from_id = $2) OR (to_id = $2 AND from_id = $1);',
        [myUserId,otherUserId]);
};

exports.acceptFriends = (myUserId, otherUserId) => {
    return db.query('UPDATE getfriends SET accepted=true WHERE to_id = $1 AND from_id = $2;',
        [myUserId,otherUserId]);
};

exports.getMyFriend = (myUserId, otherUserId) => {
    return db.query('INSERT INTO getfriends (from_id, to_id, accepted) VALUES ($1,$2,false);',
        [myUserId,otherUserId]);
};

exports.deleteFriends = (myUserId, otherUserId) => {
    return db.query('DELETE FROM getfriends WHERE (to_id = $1 AND from_id = $2) OR (to_id = $2 AND from_id = $1);',
        [myUserId,otherUserId]);
};

exports.loadFriends = myUserId => {
    return db.query(`SELECT * FROM getfriends 
                        JOIN users
                            ON (accepted=false AND from_id=users.id AND to_id=$1)
                            OR (accepted=true  AND from_id=users.id AND to_id=$1)
                            OR (accepted=true  AND from_id=$1       AND to_id=users.id);`,
    [myUserId]);
};

exports.getChatHistory = () => {
    return db.query(`SELECT * FROM 
                        (SELECT chat.id as chat_id, * FROM chat 
                            JOIN users 
                                ON (users.id = chat.user_id) 
                                ORDER BY chat.id DESC LIMIT 10) AS subquery
                        ORDER BY chat_id ASC;`
    );
};

exports.storeChatMessage = (userId,message) => {
    return db.query(`INSERT INTO chat (user_id,message_text) VALUES ($1,$2) RETURNING *`,
        [userId,message]);
};

exports.changeAccount = (userId,firstname,lastname) => {
    return db.query('UPDATE users SET firstname=$2, lastname=$3 WHERE id = $1 RETURNING *;',
        [userId,firstname,lastname]);
};

exports.deleteUserChat = userId => {
    return db.query('DELETE FROM chat WHERE user_id=$1;',
        [userId]);
};

exports.deleteFriendsFromUser = userId => {
    return db.query('DELETE FROM getfriends WHERE from_id=$1 OR to_id=$1;',
        [userId]);
};

exports.deleteUser = userId => {
    return db.query('DELETE FROM users WHERE id=$1;',
        [userId]);
};

exports.socketIdUser = (userId, socketId) => {
    return db.query('INSERT INTO sockets (user_id, socket_id) VALUES ($1,$2);',
        [userId, socketId]);
};

exports.deleteSocket = userId => {
    return db.query('DELETE FROM sockets WHERE user_id=$1;',
        [userId]);
};

exports.getAllUsersOnline = userId => {
    return db.query(`SELECT users.id AS user_id, users.firstname, users.lastname, users.profile_picture_url
                         FROM users 
                            JOIN (SELECT user_id FROM sockets WHERE user_id!=$1 GROUP BY user_id) AS onlineSocket
                            ON onlineSocket.user_id=users.id;`,
    [userId]);
};

exports.getAllFriendsOnline = userId => {
    return db.query(`SELECT allOnlineUsers.id AS user_id,* FROM 
                        (SELECT users.id, users.firstname, users.lastname, users.profile_picture_url
                            FROM users 
                            JOIN (SELECT user_id FROM sockets GROUP BY user_id) AS onlineSocket
                            ON onlineSocket.user_id=users.id) AS allOnlineUsers
                                JOIN getfriends
                                    ON (allOnlineUsers.id=getfriends.from_id AND getfriends.to_id=$1 AND getfriends.accepted=true)
                                    OR (allOnlineUsers.id=getfriends.to_id AND getfriends.from_id=$1 AND getfriends.accepted=true);`,
    [userId]);
};

exports.getSocketId = userId => {
    return db.query(`SELECT id, socket_id FROM sockets WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1;`,
        [userId]);
};

