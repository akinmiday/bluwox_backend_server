import request from 'supertest';
import { createApp } from '../createApp';
import poolPromise from '../config/db';

let app = createApp();
let token: string;
const uniqueEmail = `tasks__test_${Date.now()}@example.com`; // unique email

describe('Auth Routes', () => {
  beforeAll(async () => {
    app = createApp();

    // Register a new user with a unique email
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        email: uniqueEmail,
        password: 'password123',
        firstname: 'Tasky',
        lastname: 'Tester',
        phone: '9999999999'
      });

    // You may get 201 or 400 if user already exists; for testing, expect 201.
    expect(registerRes.status).toBe(201);

    // Login the user
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.message).toBe('Login successful');
    expect(loginRes.body.token).toBeDefined();

    token = loginRes.body.token;
  });

  it('should login a user', async () => {
    // This test is partly covered in beforeAll but you could re-test it here if desired:
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.token).toBeDefined();
  });

  afterAll(async () => {
    // Clean up: close DB connection pool to prevent open handle warnings
    const poolInstance = await poolPromise;
    await poolInstance.end();
  });
});
