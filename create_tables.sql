drop table if exists have;
drop table if exists plays;
drop table if exists interacts;
drop table if exists states;
drop table if exists objects;
drop table if exists games;
drop table if exists users;

CREATE TABLE users(
    user_id INT(6) ZEROFILL NOT NULL,
    user_name VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(50)     NOT NULL,
    email VARCHAR(100)    NOT NULL,
    hash  VARCHAR(100)    NOT NULL,
    salt  VARCHAR(100)    NOT NULL,
    global_score    INT(8) ZEROFILL DEFAULT NULL,
    session_id      VARCHAR(100) NOT NULL,
    location  VARCHAR(100),
    PRIMARY KEY (user_id)
);

CREATE TABLE games(
    game_id   INT(10) ZEROFILL NOT NULL,
    starttime DATETIME,
    endtime   DATETIME,
    PRIMARY KEY (game_id)
);

CREATE TABLE plays(
    game_id   INT(10) ZEROFILL NOT NULL,
    user_id   INT(6) ZEROFILL NOT NULL,
    game_score INT(10) ZEROFILL DEFAULT 0,
    PRIMARY KEY (game_id,user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE objects(
    object_id INT(10) ZEROFILL NOT NULL,
    desription  VARCHAR(150),
    shape VARCHAR(100),
    color VARCHAR(100),
    type VARCHAR(100),
    PRIMARY KEY (object_id)
);

CREATE TABLE interacts(
  user_id   INT(6) ZEROFILL NOT NULL,
  object_id INT(10) ZEROFILL NOT NULL,
  hits INT(6) DEFAULT 0,
  PRIMARY KEY (user_id,object_id),
  FOREIGN KEY (object_id) REFERENCES objects(object_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE states(
    state_id INT(10) ZEROFILL NOT NULL,
    object_id INT(10) ZEROFILL NOT NULL,
    location  VARCHAR(100) NOT NULL,
    PRIMARY KEY (object_id,state_id,location),
    FOREIGN KEY (object_id) REFERENCES objects(object_id) ON DELETE CASCADE
);
