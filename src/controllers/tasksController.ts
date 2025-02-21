import { RequestHandler } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * CREATE a new task linked to a specific user.
 */
export const createTask: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const { name, date, price, status } = req.body;

    if (!userId || !name || !date || !status) {
      res.status(400).json({ error: 'Missing required fields' });
      return; // only `return;`, do not return `res.status()`
    }

    await pool.query(
      `INSERT INTO tasks (user_id, name, date, price, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, name, date, price, status]
    );

    // Send response and return nothing
    res.status(201).json({ message: 'Task created successfully' });
    return;
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

/**
 * GET all tasks for a specific user.
 */
export const getUserTasks: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ error: 'User ID not provided' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );

    // Again, just send the response
    res.json(rows);
    return;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
