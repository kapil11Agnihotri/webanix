module.exports = {
  up: `
        CREATE TABLE IF NOT EXISTS categories( 
            id varchar(36) PRIMARY KEY,
            title varchar(255) NULL,
            slug varchar(255) NULL,
            featured_image text NULL,
            alt varchar(255) NULL,
            heading varchar(255) NULL,
            content longtext NULL,
            meta_title text NULL,
            meta_description text NULL,
            keywords text NULL,
            tags text NULL,
            og_title text NULL,
            og_description text NULL,
            og_image text NULL,
            og_alt varchar(255) NULL,
            structured_data text NULL,
            is_deleted tinyint DEFAULT 0,
            created_at timestamp NULL,
            updated_at timestamp NULL
        );`,
  down: `DROP TABLE IF EXISTS categories`,
};
