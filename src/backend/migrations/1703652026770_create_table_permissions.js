module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS permissions(
        id varchar(36) PRIMARY KEY,
        name varchar(255) NULL,
        action varchar(255) NULL,
        created_at timestamp NULL,
        updated_at timestamp NULL
    );`,
  down: `DROP TABLE IF EXISTS permissions`,
};
