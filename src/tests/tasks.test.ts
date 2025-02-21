// tests/tasks.test.ts
import request from 'supertest';
import { createApp } from '../createApp';
import pool from '../config/db';

let app = createApp();
let token: string; // We'll store the JWT token here once we log in

describe('Tasks Routes', () => {
  //
  // 1. Create a user & log in to get a token
  //
  beforeAll(async () => {
    // Make sure we have a fresh app instance each time
    app = createApp();

    // 1a. Register a new user
    // Using a random email in case your DB doesn't reset between tests
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        email: 'tasks11test@example.com',
        password: 'password123',
        firstname: 'Tasky',
        lastname: 'Tester',
        phone: '9999999999'
      });

    // It's fine if user is already registered (201) or 'User already exists' (400).

    // 1b. Login that user to get a token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'tasks11test@example.com',
        password: 'password123'
      });

    // Expect login to succeed with 200 status
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.message).toBe('Login successful');
    expect(loginRes.body.token).toBeDefined();

    // Store the token for subsequent tests
    token = loginRes.body.token;
  });

  //
  // 2. Test creating a new task
  //
  it('should create a new task for the authenticated user', async () => {
    const createTaskRes = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`) // Provide the JWT token
      .send({
        name: 'Job name',
        date: '2024-03-02',
        price: '30,000',
        status: 'Pending'
      });

    expect(createTaskRes.status).toBe(201);
    expect(createTaskRes.body.message).toBe('Task created successfully');
  });

  //
  // 3. Test retrieving tasks for the authenticated user
  //
  it('should get all tasks for the authenticated user', async () => {
    const getTasksRes = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(getTasksRes.status).toBe(200);
    // Should return an array of tasks
    expect(Array.isArray(getTasksRes.body)).toBe(true);
    // The newly created task should be in this array
    // (Simplistic check for demonstration; check specific fields in a real test)
    const tasks = getTasksRes.body;
    expect(tasks.length).toBeGreaterThanOrEqual(1);
  });

  //
  // 4. Clean up & close DB connections
  //
  afterAll(async () => {
    // Await the pool promise to get the actual pool instance
    const poolInstance = await pool;
    await poolInstance.end();
  });
  
});
