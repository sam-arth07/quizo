import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB || 'quizo_db',
	port:26273,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
  });
export default pool;
