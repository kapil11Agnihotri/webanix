module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS contacts( 
        id varchar(36) PRIMARY KEY,
        name varchar(255) NULL,
        email varchar(255) NULL,
        mobile int(20) NULL,
        message varchar(300) NULL,    
        created_at timestamp NULL,
        updated_at timestamp NULL
    );
  `,
  down: `DROP TABLE IF EXISTS contacts`,
};
