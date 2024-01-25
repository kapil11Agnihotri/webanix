module.exports = {
  up: `
        CREATE TABLE IF NOT EXISTS queries( 
            id varchar(36) PRIMARY KEY,
            name varchar(255) NULL,
            email varchar(255) NULL,
            mobile varchar(255) NULL,
            linkedin varchar(255) NULL,
            company_name varchar(255) NULL,
            designation varchar(255) NULL,
            company_size int NULL,
            location varchar(255) NULL,
            document varchar(255) NULL,
            message varchar(255) NULL,
            current_ctc bigint(20) NULL,
            excepted_ctc bigint(20) NULL,
            notice_period bigint(20) NULL,
            experience int(11) NULL,
            query_type varchar(255) NULL,
            is_agree tinyint NULL default 0,
            created_at timestamp NULL,
            updated_at timestamp NULL
        );`,
  down: `DROP TABLE IF EXISTS queries`,
};
