const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');

test('API authentication, migration, ownership and static-data isolation', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'finlit-test-'));
    process.env.FINLIT_DATA_DIR = dir;
    fs.writeFileSync(path.join(dir, 'users.json'), JSON.stringify({ users: [
        { id: 'legacy-test', username: 'Synthetic', email: 'legacy@example.test', password: 'synthetic-legacy-password' }
    ] }));
    let server;
    try {
        const app = require('../server');
        server = app.listen(0, '127.0.0.1');
        await once(server, 'listening');
        const base = 'http://127.0.0.1:' + server.address().port;
        async function request(url, method = 'GET', body, token) {
            const headers = {};
            if (body !== undefined) headers['Content-Type'] = 'application/json';
            if (token) headers.Authorization = 'Bearer ' + token;
            const res = await fetch(base + url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
            return { status: res.status, body: res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text() };
        }
        const legacy = await request('/api/users/login', 'POST', { email: 'legacy@example.test', password: 'synthetic-legacy-password' });
        assert.equal(legacy.status, 200);
        const migrated = JSON.parse(fs.readFileSync(path.join(dir, 'users.json'))).users[0];
        assert.equal(migrated.password, undefined);
        assert.match(migrated.passwordHash, /^scrypt\$/);
        assert.equal(legacy.body.user.passwordHash, undefined);
        const first = await request('/api/users/register', 'POST', { username: 'First', email: 'first@example.test', password: 'synthetic-first-password' });
        const second = await request('/api/users/register', 'POST', { username: 'Second', email: 'second@example.test', password: 'synthetic-second-password' });
        assert.equal(first.status, 201);
        assert.equal(second.status, 201);
        assert.equal(first.body.user.passwordHash, undefined);
        const login = await request('/api/users/login', 'POST', { email: 'FIRST@example.test', password: 'synthetic-first-password' });
        assert.equal(login.status, 200);
        assert.equal((await request('/api/users/login', 'POST', { email: 'first@example.test', password: 'wrong-password' })).status, 401);
        assert.equal((await request('/api/users')).status, 401);
        assert.equal((await request('/api/users', 'GET', undefined, first.body.token)).status, 403);
        assert.equal((await request('/data/users.json')).status, 404);
        const save = { userId: first.body.user.id, calculationType: 'budget', calculationData: { amount: 100 } };
        assert.equal((await request('/api/calculations/save', 'POST', save)).status, 401);
        assert.equal((await request('/api/calculations/save', 'POST', save, second.body.token)).status, 403);
        const saved = await request('/api/calculations/save', 'POST', save, login.body.token);
        assert.equal(saved.status, 201);
        assert.equal((await request('/api/calculations/' + first.body.user.id, 'GET', undefined, second.body.token)).status, 403);
        assert.equal((await request('/api/calculations/' + saved.body.calculation.id, 'DELETE', undefined, second.body.token)).status, 404);
        assert.equal((await request('/api/calculations/' + first.body.user.id, 'GET', undefined, first.body.token)).body.calculations.length, 1);
        assert.equal((await request('/api/calculations/' + saved.body.calculation.id, 'DELETE', undefined, first.body.token)).status, 200);
        assert.equal((await request('/api/users/logout', 'POST', {}, first.body.token)).status, 200);
        assert.equal((await request('/api/calculations/' + first.body.user.id, 'GET', undefined, first.body.token)).status, 401);
    } finally {
        if (server) await new Promise(resolve => server.close(resolve));
        delete process.env.FINLIT_DATA_DIR;
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
