import dotenv from 'dotenv';
import { createApp } from './createApp';
import pool from './config/db'; 

dotenv.config(); 

async function startServer() {
  try {
    // getConnection test
    const connection = await pool.getConnection();
    console.log('Database connection established successfully.');
    connection.release();

    // Create the Express app
    const app = createApp();

    // Read port from env or default to 3000
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


    // Start listening
    app.listen(PORT, '0.0.0.0',() => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit if the DB connection fails
  }
}

// Invoke startup function
startServer();
