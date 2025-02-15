import pool from "./db";

export async function initializeDatabase() {
	try {
		// Create the users table if it doesn't exist.
		await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

		// Create the quizzes table if it doesn't exist.
		await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        teacher_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      )
    `);

		await pool.query(`
        INSERT INTO users (username, password)
        SELECT * FROM (SELECT 'teacher' AS username, 'password123' AS password) AS tmp
        WHERE NOT EXISTS (
            SELECT username FROM users WHERE username = 'teacher'
        ) LIMIT 1;
      `);

		console.log("Database schema initialized successfully.");
	} catch (error) {
		console.error("Error initializing database schema:", error);
	}
}
