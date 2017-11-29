DROP TRIGGER IF EXISTS before_user_insert;
DROP TRIGGER IF EXISTS update_user;
DROP TRIGGER IF EXISTS delete_user;
DROP TRIGGER IF EXISTS before_games_insert;
DROP TRIGGER IF EXISTS after_games_insert;

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
  INSERT INTO plays values(5,NEW.game_id,0);
END;
# ---------------------------

-- 	IF NOT NEW.performance_fee = 0 THEN
-- 		SET NEW.performance_fee = 0;
-- 	END IF;
-- 	IF NOT NEW.management_fee = 0 THEN
-- 		SET NEW.management_fee = 0;
-- 	END IF;
-- 	IF NEW.client_id IN (SELECT client_id FROM Portfolio) THEN
-- 		CALL ` Error3: Client already owns a portfolio.`;
-- 	END IF;
-- 	IF NEW.cash_amount < 0 THEN
-- 		CALL ` Error4: Cash value can not be negative.`;
-- 	END IF;
-- 	IF NEW.client_id NOT in (SELECT user_id FROM Users WHERE authority_level LIKE 'Client') THEN
-- 		CALL ` Error4: Client ID is not matching an existing Client.`;
-- 	END IF;
-- 	IF NEW.manager_id NOT in (SELECT user_id FROM Users WHERE authority_level LIKE 'Manager') THEN
-- 		CALL ` Error5: Manager ID is not matching an existing Manager.`;
-- 	END IF;
-- END;
-- # --------------------------
-- CREATE TRIGGER update_portfolio BEFORE UPDATE ON Portfolio
-- FOR EACH ROW
-- BEGIN
-- 	IF NEW.cash_amount < 0 THEN
-- 		CALL ` Error6 : Cash amount is not sufficient for this transaction.`;
-- 	END IF;
-- 	SET @current_value = (SELECT value FROM Portfolio WHERE id = NEW.id);
-- 	IF NOT NEW.value = @current_value THEN
-- 		SET NEW.performance_fee = (1.5/100) * NEW.value;
-- 		SET NEW.management_fee = (1/100) * NEW.value;
-- 	END IF;
-- END;
-- # ------------------------------------------------------------------------------------------------
-- # ----Asset Table Triggers
-- CREATE TRIGGER before_asset_insert BEFORE INSERT ON Asset
-- FOR EACH ROW
-- BEGIN
-- 	SET @id = (SELECT MAX(asset_id) FROM Asset);
-- 	IF @id IS NULL THEN
-- 		SET @id = 0;
-- 	END IF;
-- 	SET NEW.asset_id = @id + 1;
-- 	IF NEW.type NOT IN ('stock','bond') THEN
-- 		CALL ` Error7: Security type can either be "Stock" or "Bond".`;
-- 	END IF;
-- 	IF NEW.type in (SELECT type FROM Asset WHERE asset_name = NEW.asset_name) THEN
-- 		CALL ` Error8: Security type already exists for this entity.`;
-- 	END IF;
-- END;
-- # ----------------------------------------
-- CREATE TRIGGER after_asset_insert AFTER INSERT ON Asset
-- FOR EACH ROW
-- BEGIN
-- 	IF NEW.type = 'bond' THEN
-- 		SET @maturity = ADDDATE(CURRENT_DATE,INTERVAL 5*365 DAY);
-- 		INSERT INTO Bond VALUES(NEW.asset_id, @maturity);
-- 	END IF;
-- END;
-- # ----------------------------------------
-- CREATE TRIGGER before_asset_update BEFORE UPDATE ON Asset
-- FOR EACH ROW
-- BEGIN
-- 	SET @old_price = (SELECT price FROM Asset WHERE asset_id = NEW.asset_id);
-- 	SET @diff = NEW.price - @old_price;
-- 	UPDATE Portfolio AS A, Percentage AS B SET A.value = A.value + (@diff * B.units)
-- 	WHERE A.id = B.portfolio_id AND B.asset_id = NEW.asset_id;
-- END;
-- # ----------------------------------------
-- CREATE TRIGGER after_asset_update AFTER UPDATE ON Asset
-- FOR EACH ROW
-- BEGIN
-- 	UPDATE Percentage AS A, (SELECT portfolio_id FROM Percentage WHERE asset_id = NEW.asset_id) AS B, Portfolio AS C
-- 	SET A.percentage = (A.units / C.value) * (SELECT price FROM Asset WHERE Asset.asset_id = A.asset_id)
-- 	WHERE A.portfolio_id = B.Portfolio_id AND A.portfolio_id = C.id AND C.value > 0;
-- END;
-- # ---------------------------------------------------------------------------------------------------
-- # ----Transaction Table Triggers
-- CREATE TRIGGER before_insert_transaction BEFORE INSERT ON Transaction
-- FOR EACH ROW
-- BEGIN
-- 	SET @t_id = (SELECT MAX(id) FROM Transaction);
-- 	IF @t_id IS NULL THEN
-- 		SET @t_id = 0;
-- 	END IF;
-- 	SET NEW.id = @t_id + 1;
-- 	SET NEW.trans_time = CURRENT_TIMESTAMP;
-- 	SET NEW.unit_price = (SELECT price FROM Asset WHERE Asset.asset_id = NEW.asset_id);
-- 	IF NEW.units = 0 THEN
-- 		CALL ` Error9: Please indicate the number of units.`;
-- 	END IF;
-- 	IF NEW.units > 0 THEN
-- 		SET @cash_req = NEW.unit_price * NEW.units;
-- 		IF @cash_req > (SELECT cash_amount FROM Portfolio WHERE Portfolio.id = NEW.portfolio_id) THEN
-- 			CALL ` Error10: Cash amount is NOT sufficient for this transaction.`;
-- 		END IF;
-- 	ELSE
-- 		SET @current_units = (SELECT units FROM Percentage WHERE Percentage.asset_id = NEW.asset_id AND Percentage.portfolio_id = NEW.portfolio_id);
-- 		IF @current_units IS NULL THEN
-- 			CALL ` Error11: No Available units of this asset.`;
-- 		END IF;
-- 		SET @target_units = @current_units + NEW.units;
-- 		IF @target_units < 0 THEN
-- 			CALL ` Error12: Available units are less than the required for sale.`;
-- 		END IF;
-- 	END IF;
-- END;
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
-- # ---------------------------------------
-- CREATE TRIGGER after_insert_transaction AFTER INSERT ON Transaction
-- FOR EACH ROW
-- BEGIN
-- 	SET @current_cash = (SELECT cash_amount FROM Portfolio WHERE Portfolio.id = NEW.portfolio_id);
-- 	SET @req_cash = NEW.units * NEW.unit_price;
-- 	SET @new_cash = @current_cash - @req_cash;
-- 	UPDATE Portfolio SET cash_amount = @new_cash WHERE Portfolio.id = NEW.portfolio_id;
-- 	SET @current_units = (SELECT units FROM Percentage WHERE Percentage.portfolio_id = NEW.portfolio_id AND Percentage.asset_id = NEW.asset_id);
-- 	IF @current_units IS NULL THEN
-- 		INSERT INTO Percentage(asset_id,units,portfolio_id) VALUES(NEW.asset_id,NEW.units,NEW.portfolio_id);
-- 		CALL change_percentage(NEW.asset_id,NEW.units,NEW.portfolio_id);
-- 	ELSE
-- 		UPDATE Percentage SET units = @current_units + NEW.units WHERE asset_id = NEW.asset_id AND portfolio_id = NEW.portfolio_id;
-- 		CALL change_percentage(NEW.asset_id,NEW.units,NEW.portfolio_id);
-- 	END IF;
-- END;
# ---------------------------------------------------------------------------------------
//
DELIMITER ;
