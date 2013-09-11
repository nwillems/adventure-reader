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
    "entry_link" VARCHAR(255) ,
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
-- patch_001
ALTER TABLE "entries" ADD CONSTRAINT "uq_item_id" UNIQUE ("item_id");
-- patch_002
ALTER TABLE "users" ADD CONSTRAINT "uq_ext_id" UNIQUE ("user_ext_id");
