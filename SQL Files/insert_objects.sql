-- Create coins object and add it to a certain state
INSERT INTO objects(object_name,shape,type) VALUES('coin','circle','score_item');
INSERT INTO states(state_name) VALUES('collect_coins');
INSERT INTO summons VALUES(1,1,'1141,1341');
INSERT INTO summons VALUES(1,1,'1212,1237');
INSERT INTO summons VALUES(1,1,'1346,1112');
INSERT INTO summons VALUES(1,1,'1024,1451');

# --------------------------------------------------------------------------------------------------
# ----Add a user and score
INSERT INTO users VALUES(1,'Moaz','#2600ff','moaz.mansour@xyz.com','bcdc32962f2824865c9f81d6b976fc92','1512170704789',0,'loggedout',NULL);
CALL start_game('Moaz');
INSERT INTO interacts VALUES(1,1,1,300);
CALL end_game('Moaz');
CALL start_game('Moaz');
INSERT INTO interacts VALUES(1,1,2,400);
CALL end_game('Moaz');
CALL start_game('Moaz');
INSERT INTO interacts VALUES(1,1,3,500);
CALL end_game('Moaz');
