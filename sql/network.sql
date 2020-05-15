DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset_codes;
DROP TABLE IF EXISTS getfriends;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(250) NOT NULL,
    profile_picture_url VARCHAR(500),
    bio VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE getfriends (
    id SERIAL PRIMARY KEY,
    from_id INT NOT NULL,
    to_id INT NOT NULL,
    accepted Boolean,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

