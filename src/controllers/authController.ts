import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone } = req.body;

    // Check if user already exists
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if ((rows as any[]).length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query(
      `INSERT INTO users (email, password, firstname, lastname, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, firstname, lastname, phone]
    );

    res.status(201).json({ message: 'User registered successfully' });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = (rows as any[])[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const logout: RequestHandler = async (req, res) => {
  // For stateless JWT, you typically handle logout client-side
  // or store tokens in DB if you want to revoke them.
  res.json({ message: 'Logout successful' });
  return;
};
