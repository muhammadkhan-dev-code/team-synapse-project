const request = require('supertest');
const app = require('../src/app');
const { connectDb, closeDb, clearDb } = require('./utils/db');
const User = require('../src/modules/auth/user.model');
const Ride = require('../src/modules/rides/ride.model');
const jwt = require('jsonwebtoken');

jest.setTimeout(60000);

beforeAll(async () => {
  await connectDb();
});

afterEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await closeDb();
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
};

describe('Integration Tests (Happy Path)', () => {
  let token;
  let userId;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'testsecret';
    const user = await User.create({
      name: 'Integration User',
      email: 'int@uni.edu',
      password: 'password123',
      isVerified: true
    });
    userId = user._id;
    token = generateToken(userId);
  });

  it('Auth - Health Check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('Rides - Create a Ride', async () => {
    const res = await request(app)
      .post('/api/v1/rides')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: 'Campus',
        destination: 'Downtown',
        departureTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        availableSeats: 3,
        price: 15
      });
    expect(res.status).toBe(201);
    expect(res.body.data.origin).toBe('Campus');
  });
  
  // Note: Full E2E for ratings requires seeding a completed ride and accepted requests, which is extensive.
  // The small subset validates the framework and API mounting.
});
