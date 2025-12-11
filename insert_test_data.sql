USE health;

-- INSERT DEFAULT USER (required for marking)

-- Password = smiths123ABC$
-- Bcrypt hash generated with 10 salt rounds
INSERT INTO users (username, password_hash)
VALUES 
('gold', '$2b$10$8ExJn757oLt192qp1rhYHe2HpIbhk05je9Ez5Jh8knGJKPGI13ib6');

-- Get the inserted user ID (usually 1)
SET @userId = LAST_INSERT_ID();

-- INSERT SAMPLE ACTIVITIES

INSERT INTO activities (user_id, type, duration, calories, notes, date)
VALUES
(@userId, 'Running', 30, 300, 'Morning jog around the park', '2024-12-01'),
(@userId, 'Cycling', 45, 450, 'Road cycle session', '2024-12-02'),
(@userId, 'Weightlifting', 60, 250, 'Upper body workout', '2024-12-03'),
(@userId, 'Swimming', 40, 350, 'Indoor pool training', '2024-12-04'),
(@userId, 'Walking', 20, 100, 'Light walk to stay active', '2024-12-05');
