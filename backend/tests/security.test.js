const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { app } = require('../index');

const TEST_PASSWORD = 'Strong!Pass123';
const BAD_PASSWORD = 'weak';

function uniqueEmail() {
  return `test.user.${Date.now()}@example.com`;
}

async function connectDb() {
  const uri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI_TEST or MONGODB_URI must be set to run tests');
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function cleanupTestUsers() {
  await User.deleteMany({ email: /test\.user\./ });
  await AuditLog.deleteMany({});
}

test('security suite', async (t) => {
  await connectDb();
  await cleanupTestUsers();

  t.after(async () => {
    await cleanupTestUsers();
    await mongoose.disconnect();
  });

  await t.test('rejects weak password on registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('X-Forwarded-For', '10.0.0.1')
      .send({ email: uniqueEmail(), password: BAD_PASSWORD });

    assert.equal(response.status, 400);
  });

  await t.test('registers and logs in with secure cookies', async () => {
    const email = uniqueEmail();

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .set('X-Forwarded-For', '10.0.0.2')
      .send({ email, password: TEST_PASSWORD });

    assert.equal(registerResponse.status, 201);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.0.3')
      .send({ email, password: TEST_PASSWORD });

    assert.equal(loginResponse.status, 200);
    const cookies = loginResponse.headers['set-cookie'] || [];
    const accessCookie = cookies.find((cookie) => cookie.startsWith('access_token='));
    assert.ok(accessCookie);
    assert.ok(accessCookie.includes('HttpOnly'));
    assert.ok(accessCookie.includes('SameSite=Strict'));
  });

  await t.test('rate limits login attempts', async () => {
    const email = uniqueEmail();

    await request(app)
      .post('/api/auth/register')
      .set('X-Forwarded-For', '10.0.0.4')
      .send({ email, password: TEST_PASSWORD });

    for (let i = 0; i < 5; i += 1) {
      const response = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', '10.0.0.5')
        .send({ email, password: 'Wrong!Pass123' });

      assert.equal(response.status, 401);
    }

    const limitedResponse = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.0.5')
      .send({ email, password: 'Wrong!Pass123' });

    assert.equal(limitedResponse.status, 429);
  });

  await t.test('locks account after repeated failures', async () => {
    const email = uniqueEmail();

    await request(app)
      .post('/api/auth/register')
      .set('X-Forwarded-For', '10.0.0.6')
      .send({ email, password: TEST_PASSWORD });

    for (let i = 0; i < 5; i += 1) {
      const response = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', `10.0.1.${i}`)
        .send({ email, password: 'Wrong!Pass123' });

      assert.equal(response.status, 401);
    }

    const lockedResponse = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.1.200')
      .send({ email, password: TEST_PASSWORD });

    assert.equal(lockedResponse.status, 423);
  });

  await t.test('requires CSRF token on state-changing routes', async () => {
    const email = uniqueEmail();
    const agent = request.agent(app);

    await agent
      .post('/api/auth/register')
      .set('X-Forwarded-For', '10.0.0.7')
      .send({ email, password: TEST_PASSWORD });

    await agent
      .post('/api/auth/login')
      .set('X-Forwarded-For', '10.0.0.7')
      .send({ email, password: TEST_PASSWORD });

    await agent.get('/api/auth/csrf').set('X-Forwarded-For', '10.0.0.7');

    const logoutResponse = await agent
      .post('/api/auth/logout')
      .set('X-Forwarded-For', '10.0.0.7');

    assert.equal(logoutResponse.status, 403);
  });
});
