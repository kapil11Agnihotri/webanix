module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS user_has_permissions(
        id varchar(36) PRIMARY KEY,
        user_id varchar(36) NULL,
        role_id varchar(36) NULL,
        permission_id varchar(36) NULL,
        created_at timestamp NULL,
        updated_at timestamp NULL          
    );`,
  down: `DROP TABLE IF EXISTS user_has_permissions`,
};
