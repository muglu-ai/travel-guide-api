// tests/unit/index.test.js
const request = require('supertest');
const app = require('../../src/app'); // Adjust the path as necessary

describe('Unit Tests', () => {
  it('should return a welcome message on the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to the Travhoo');
  });

  // Add more unit tests as needed
});