module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS users( 
        id varchar(36) PRIMARY KEY,
        name varchar(255) NULL,
        email varchar(255) NULL,
        password varchar(255) NULL,
        role_id varchar(36) NULL,
        is_active tinyint(1) default(1) NOT NULL,
        is_deleted tinyint(1) default(0) NOT NULL,
        otp varchar(10) NULL,
        created_at timestamp NULL,
        updated_at timestamp NULL
    );
    `,
  down: `DROP TABLE IF EXISTS users`,
};
