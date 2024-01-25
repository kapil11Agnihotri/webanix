module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS blog_types( 
        id varchar(36) PRIMARY KEY,
        name varchar(255) NULL,
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
  down: `DROP TABLE IF EXISTS blog_types`,
};
