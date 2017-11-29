DROP TRIGGER IF EXISTS before_user_insert;
DROP TRIGGER IF EXISTS update_user;
DROP TRIGGER IF EXISTS delete_user;
DROP TRIGGER IF EXISTS before_games_insert;
DROP TRIGGER IF EXISTS after_games_insert;
DROP TRIGGER IF EXISTS games_update;
DROP TRIGGER IF EXISTS before_objects_insert;
DROP TRIGGER IF EXISTS before_states_insert;
DROP TRIGGER IF EXISTS before_plays_insert;
DROP TRIGGER IF EXISTS before_interacts_insert;

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
CREATE TRIGGER after_games_insert AFTER INSERT ON games
FOR EACH ROW
BEGIN
  INSERT INTO plays(user_id,game_id) values(5,NEW.game_id);
END;
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
# --------------------------------------------------------------------------------------------------
# ----Interacts relation Triggers
CREATE TRIGGER before_interacts_insert BEFORE INSERT ON interacts
FOR EACH ROW
BEGIN
  SET NEW.hits = 0;
END;
# --------------------------------------------------------------------------------------------------
-- # ----------------------------------
-- CREATE PROCEDURE change_percentage(IN a_id INT, IN n_units INT, IN p_id int)
-- BEGIN
-- 	SET @price = (SELECT price FROM Asset WHERE asset_id = a_id);
-- 	SET @tran_value = n_units * @price;
-- 	SET @current_value = (SELECT value FROM Portfolio WHERE Portfolio.id = p_id);
-- 	SET @new_value = @current_value + @tran_value;
-- 	UPDATE Portfolio SET value = @new_value WHERE Portfolio.id = p_id;
-- 	IF @new_value = 0 THEN
-- 		UPDATE Percentage SET percentage = 0 WHERE portfolio_id = p_id;
-- 	ELSE
-- 		UPDATE Percentage SET percentage = (Percentage.units / @new_value) * (SELECT price FROM Asset WHERE Asset.asset_id = Percentage.asset_id)
-- 		WHERE portfolio_id = p_id;
-- 	END IF;
-- END;
-- 		CALL change_percentage(NEW.asset_id,NEW.units,NEW.portfolio_id);
# ---------------------------------------------------------------------------------------
//
DELIMITER ;
