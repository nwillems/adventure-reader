CREATE TABLE IF NOT EXISTS "feeds"(
    "feed_id"  SERIAL ,
    "feed_title" VARCHAR(255) NOT NULL DEFAULT 'NULL' ,
    "feed_url" VARCHAR(255) ,
    "feed_ttl" INTEGER ,
    PRIMARY KEY ("feed_id")
);

CREATE TABLE IF NOT EXISTS "entries"(
    "entry_id"  SERIAL ,
    "item_id" VARCHAR,
    "feed_id" INTEGER NOT NULL ,
    "entry_published" TIMESTAMP ,
    "entry_title" TEXT ,
    "entry_author" VARCHAR(255) ,
    PRIMARY KEY ("entry_id")
);

CREATE TABLE IF NOT EXISTS "users"(
    "id"  SERIAL ,
    "username" VARCHAR(255) ,
    "user_ext_id" INTEGER ,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "users_feeds" (
    "feed_id_feeds" INTEGER ,
    "id_users" INTEGER
);

CREATE TABLE IF NOT EXISTS "read" (
    "entry_id_entries" INTEGER ,
    "id_users" INTEGER
);

ALTER TABLE "entries" ADD FOREIGN KEY ("feed_id") REFERENCES "feeds" ("feed_id");
ALTER TABLE "users_feeds" ADD FOREIGN KEY ("feed_id_feeds") REFERENCES "feeds" ("feed_id");
ALTER TABLE "users_feeds" ADD FOREIGN KEY ("id_users") REFERENCES "users" ("id");
ALTER TABLE "read" ADD FOREIGN KEY ("entry_id_entries") REFERENCES "entries" ("entry_id");
ALTER TABLE "read" ADD FOREIGN KEY ("id_users") REFERENCES "users" ("id");

-- -------------------------------------------
-- UPDATES
-- -------------------------------------------
ALTER TABLE "entries" ADD CONSTRAINT "uq_item_id" UNIQUE ("item_id");
CREATE FUNCTION ignore_duplicates_entries() RETURNS Trigger
AS $$
BEGIN
    IF EXISTS (
        SELECT item_id FROM entries
        WHERE item_id = NEW.item_id
    ) THEN
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_ignore_duplicates
    BEFORE Insert ON entries
    FOR EACH ROW
    EXECUTE PROCEDURE ignore_duplicates_entries();
