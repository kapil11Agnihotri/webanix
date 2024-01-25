module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS pages( 
        id varchar(36) PRIMARY KEY,
        name varchar(255) NULL,
        slug varchar(255) NULL,
        featured_image text NULL,
        alt varchar(255) NULL,
        page_json longtext NULL,
        template_type varchar(255) NULL,
        last_updated_by varchar(36) NULL,
        meta_title text NULL,
        meta_description text NULL,
        keywords text NULL,
        tags text NULL,
        og_title text NULL,
        og_description text NULL,
        og_image text NULL,
        og_alt varchar(255) NULL,
        structured_data text NULL,
        excerpt text NULL,
        is_active tinyint DEFAULT 0,
        is_deleted tinyint DEFAULT 0,
        created_at timestamp NULL,
        updated_at timestamp NULL
    );`,
  down: `DROP TABLE IF EXISTS pages`,
};
