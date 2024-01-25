module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS services( 
        id varchar(36) PRIMARY KEY,
        slug varchar(255) NULL,
        title varchar(255) NULL,
        description longtext NULL,
        tech_images longtext NULL,
        short_description text NULL, 
        featured_image text NULL,
        alt varchar(255) NULL,
        featured_for longtext NULL,
        category varchar(36) NULL,
        meta_title text NULL,
        meta_description text NULL,
        keywords text NULL,
        structured_data text NULL,
        tags text NULL,
        og_title text NULL,
        og_description text NULL,
        og_image text NULL,
        og_alt varchar(255) NULL,
        is_deleted tinyint DEFAULT 0,
        created_at timestamp NULL,
        updated_at timestamp NULL
    );`,
  down: `DROP TABLE IF EXISTS services`,
};
