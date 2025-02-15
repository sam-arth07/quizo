// netlify/functions/api.ts
import serverless from 'serverless-http';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from '../../src/db';
import { initializeDatabase } from '../../src/init'; // adjust path as needed

const app = express();
const PORT = 3001;

// Run the database initialization.
initializeDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static teacher credentials (no JWT required)
const teacherCredentials = { username: 'teacher', password: 'password123', id: 1 };

// POST /login - Validate static credentials
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === teacherCredentials.username && password === teacherCredentials.password) {
    res.json({ success: true, teacherId: teacherCredentials.id, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// POST /quizzes - Create a new quiz
app.post('/quizzes', async (req: Request, res: Response) => {
  const { title, description, teacherId } = req.body;
  if (!title || !description || !teacherId) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO quizzes (title, description, teacher_id, created_at) VALUES (?, ?, ?, NOW())',
      [title, description, teacherId]
    );
    res.json({ success: true, message: 'Quiz created successfully', quizId: (result as any).insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err });
  }
});

// GET /quizzes - Retrieve all quizzes for the teacher
app.get('/quizzes', async (req: Request, res: Response) => {
  const teacherId = req.query.teacherId;
  if (!teacherId) {
    return res.status(400).json({ success: false, message: 'Missing teacherId query parameter' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE teacher_id = ?', [teacherId]);
    res.json({ success: true, quizzes: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err });
  }
});

// GET /quizzes/:id - Retrieve a specific quiz
app.get('/quizzes/:id', async (req: Request, res: Response) => {
  const quizId = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
    if ((rows as any).length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.json({ success: true, quiz: (rows as any)[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err });
  }
});

// PUT /quizzes/:id - Update an existing quiz
app.put('/quizzes/:id', async (req: Request, res: Response) => {
  const quizId = req.params.id;
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  try {
    await pool.query('UPDATE quizzes SET title = ?, description = ? WHERE id = ?', [title, description, quizId]);
    res.json({ success: true, message: 'Quiz updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err });
  }
});

// DELETE /quizzes/:id - Delete a quiz
app.delete('/quizzes/:id', async (req: Request, res: Response) => {
  const quizId = req.params.id;
  try {
    await pool.query('DELETE FROM quizzes WHERE id = ?', [quizId]);
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the serverless handler
export const handler = serverless(app);