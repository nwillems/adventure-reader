ALTER TABLE users ALTER COLUMN user_ext_id TYPE bigint;
ALTER TABLE users ADD CONSTRAINT uq_user_ext_id UNIQUE (user_ext_id);
