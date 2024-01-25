// ********************************************************
// define the local-mysql-database connection code
// ********************************************************

// import mysql2 instead of mysql
import mysql from "mysql2/promise";

export async function query(sql, params) {
  const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  const connection = await mysql.createConnection(db);
  const [results] = await connection.execute(sql, params);

  connection.end();

  return results;
}
