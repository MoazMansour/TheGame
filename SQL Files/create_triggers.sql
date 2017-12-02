DROP TRIGGER IF EXISTS before_user_insert;
DROP TRIGGER IF EXISTS update_user;
DROP TRIGGER IF EXISTS delete_user;
DROP TRIGGER IF EXISTS before_games_insert;
DROP TRIGGER IF EXISTS after_games_insert;
DROP TRIGGER IF EXISTS games_update;
DROP TRIGGER IF EXISTS before_objects_insert;
DROP TRIGGER IF EXISTS before_states_insert;
DROP TRIGGER IF EXISTS before_plays_insert;
DROP TRIGGER IF EXISTS plays_update;
DROP TRIGGER IF EXISTS before_interacts_insert;
DROP PROCEDURE IF EXISTS reset_score;
DROP PROCEDURE IF EXISTS delete_game;
DROP PROCEDURE IF EXISTS start_game;
DROP PROCEDURE IF EXISTS end_game;


DELIMITER //

# ---- users Table TRIGGERs
CREATE TRIGGER before_user_insert BEFORE INSERT ON users
FOR EACH ROW
BEGIN
	SET @id = (SELECT MAX(user_id) FROM users);
	IF @id IS NULL THEN
		SET @id = 0;
	END IF;
	SET NEW.user_id = @id + 1;
	IF NEW.email NOT LIKE '%@%.%' THEN
		CALL ` Error0: Please correct your email format.`;
	END IF;
  -- IF NEW.user_name NOT LIKE '%[^A-Z]%' THEN
  --   CALL ` Error1: Please use alphanumeric values only for username.`;
  -- END IF;
END;
# ---------------------------
CREATE TRIGGER update_user BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
  IF NEW.email NOT LIKE '%@%.%' THEN
 		CALL ` Error0: Please correct your email format.`;
 	END IF;
END;
# ---------------------------
CREATE TRIGGER delete_user BEFORE DELETE ON users
FOR EACH ROW
BEGIN
   DELETE FROM games WHERE game_id in (SELECT game_id FROM plays WHERE user_id = OLD.user_id);
END;
# --------------------------------------------------------------------------------------------------
# ----games Table Triggers
CREATE TRIGGER before_games_insert BEFORE INSERT ON games
FOR EACH ROW
BEGIN
 	SET @id = (SELECT MAX(game_id) FROM games);
  IF @id IS NULL THEN
    SET @id = 0;
  END IF;
  SET NEW.game_id = @id + 1;
  SET NEW.starttime = CURRENT_TIMESTAMP;
  SET NEW.endtime = NULL;
END;
# ---------------------------
-- CREATE TRIGGER after_games_insert AFTER INSERT ON games
-- FOR EACH ROW
-- BEGIN
--   INSERT INTO plays(user_id,game_id) values(5,NEW.game_id);
-- END;
# ---------------------------
CREATE TRIGGER games_update BEFORE UPDATE ON games
FOR EACH ROW
BEGIN
  SET NEW.starttime = OLD.starttime;
  SET NEW.endtime = CURRENT_TIMESTAMP;
END;
# --------------------------------------------------------------------------------------------------
# ----Objects Table Triggers
CREATE TRIGGER before_objects_insert BEFORE INSERT ON objects
FOR EACH ROW
BEGIN
 	SET @id = (SELECT MAX(object_id) FROM objects);
  IF @id IS NULL THEN
    SET @id = 0;
  END IF;
  SET NEW.object_id = @id + 1;
END;
# --------------------------------------------------------------------------------------------------
# ----States Table Triggers
CREATE TRIGGER before_states_insert BEFORE INSERT ON states
FOR EACH ROW
BEGIN
  SET @id = (SELECT MAX(state_id) FROM states);
  IF @id IS NULL THEN
    SET @id = 0;
  END IF;
  SET NEW.state_id = @id + 1;
END;
# --------------------------------------------------------------------------------------------------
# ----Plays relation Triggers
CREATE TRIGGER before_plays_insert BEFORE INSERT ON plays
FOR EACH ROW
BEGIN
  SET NEW.game_score = 0;
END;
# ---------------------------
CREATE TRIGGER plays_update AFTER UPDATE ON plays
FOR EACH ROW
BEGIN
	SET @score = NEW.game_score;
	SET @id = OLD.user_id;
	UPDATE users SET global_score = global_score + @score WHERE user_id = @id;
END;
# --------------------------------------------------------------------------------------------------
# ----Interacts relation Triggers
-- CREATE TRIGGER before_interacts_insert BEFORE INSERT ON interacts
-- FOR EACH ROW
-- BEGIN
--   SET NEW.hits = 0;
-- END;
# --------------------------------------------------------------------------------------------------
# ----Procedures
CREATE PROCEDURE reset_score(IN u_name VARCHAR(20))
BEGIN
	SET @id = (SELECT user_id FROM users WHERE username = u_name);
	DELETE FROM games WHERE game_id in (SELECT game_id FROM plays WHERE user_id = @id);
	DELETE FROM plays WHERE user_id = @id;
	DELETE FROM interacts WHERE user_id = @id;
	UPDATE users SET global_score = 0 WHERE user_id = @id;
END;
-- 		CALL change_percentage(NEW.asset_id,NEW.units,NEW.portfolio_id);
# ---------------------------
CREATE PROCEDURE delete_game(IN g_id INT)
BEGIN
	SET @u_id = (SELECT user_id FROM plays WHERE game_id = g_id);
	DELETE FROM games WHERE game_id = g_id;
	SET @score = (SELECT SUM(game_score) FROM plays WHERE user_id = @u_id);
	UPDATE users SET global_score = @score WHERE user_id = @u_id;
END;
# ---------------------------
CREATE PROCEDURE start_game(IN u_name VARCHAR(20))
BEGIN
	INSERT INTO games(game_id) VALUES(1);
	SET @id = (SELECT user_id FROM users WHERE username = u_name);
	SET @game = (SELECT MAX(game_id) FROM games);
	INSERT INTO plays VALUES(@id,@game,1);
END;
# ---------------------------
CREATE PROCEDURE end_game(IN u_name VARCHAR(20))
BEGIN
	SET @id = (SELECT user_id FROM users WHERE username = u_name);
	SET @game = (SELECT MAX(game_id) FROM plays WHERE user_id = @id);
	SET @object = (SELECT object_id FROM objects WHERE object_name = 'coin');
	SET @score = (SELECT hits FROM interacts WHERE user_id= @id AND game_id = @game AND object_id = @object);
	UPDATE games SET endtime = NULL WHERE game_id = @game;
	UPDATE plays SET game_score = @score WHERE user_id = @id AND game_id = @game;
END;
# ---------------------------------------------------------------------------------------
//
DELIMITER ;
