module.exports = {
  up: `
        CREATE TABLE IF NOT EXISTS blogs( 
            id varchar(36) PRIMARY KEY,
            slug varchar(255) NULL,
            title varchar(255) NULL,
            description longtext NULL,
            short_description text NULL,
            featured_image text NULL,
            alt varchar(255) NULL,
            blog_tags longtext NULL,
            meta_title text NULL,
            meta_description text NULL,
            keywords text NULL,
            structured_data text NULL,
            tags text NULL,
            og_title text NULL,
            og_description text NULL,
            og_image text NULL,
            og_alt varchar(255) NULL,
            publish_date date NULL,
            blog_type varchar(36) NULL,
            status tinyint DEFAULT 0 comment 'status code => 0 = Draft, 1 = Pending, 2 = Published',
            is_deleted tinyint DEFAULT 0,
            created_at timestamp NULL,
            updated_at timestamp NULL
        );`,
  down: `DROP TABLE IF EXISTS blogs`,
};
