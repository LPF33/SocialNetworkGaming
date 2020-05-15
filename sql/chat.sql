DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat (user_id,message_text) VALUES (1,'Is there anyone out there?');
INSERT INTO chat (user_id,message_text) VALUES (45,'Yes, it"s me');
INSERT INTO chat (user_id,message_text) VALUES (1,'Great');
INSERT INTO chat (user_id,message_text) VALUES (36,'Me,too!');
INSERT INTO chat (user_id,message_text) VALUES (1,'WOW');
INSERT INTO chat (user_id,message_text) VALUES (1,'Anyone wanne play a game?');
INSERT INTO chat (user_id,message_text) VALUES (45,'Nope!');
INSERT INTO chat (user_id,message_text) VALUES (39,'Maybe later!');
INSERT INTO chat (user_id,message_text) VALUES (36,'Yes, I"d like to play!');
INSERT INTO chat (user_id,message_text) VALUES (1,'Cool! Which one?');
INSERT INTO chat (user_id,message_text) VALUES (36,'Meisterdieb');