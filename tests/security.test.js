const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

test('API authentication, legacy upgrade, ownership and private files', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'finlit-test-'));
    const usersFile = path.join(dir, 'users.json');
    fs.writeFileSync(usersFile, JSON.stringify({ users: [{ id: 'legacy', username: 'Legacy', email: 'legacy@example.test', password: 'legacy-test-only' }] }));
    fs.writeFileSync(path.join(dir, 'calculations.json'), JSON.stringify({ calculations: [] }));
    process.env.FINLIT_DATA_DIR = dir;
    const app = require('../server');
    const server = app.listen(0, '127.0.0.1');
    try {
        await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
        const url = 'http://127.0.0.1:' + server.address().port;
        async function request(route, method = 'GET', data, token, extraHeaders = {}) {
            const headers = { 'Content-Type': 'application/json', ...extraHeaders };
            if (token) headers.Authorization = 'Bearer ' + token;
            const res = await fetch(url + route, { method, headers, body: data === undefined ? undefined : JSON.stringify(data) });
            return { status: res.status, body: await res.json().catch(() => null), cookie: res.headers.get('set-cookie') };
        }
        const register = email => request('/api/users/register', 'POST', { username: 'Test', email, password: 'test-password' });
        const a = await register('a@example.test'), b = await register('b@example.test');
        assert.equal(a.status, 201);
        assert.equal(b.status, 201);
        const stored = JSON.parse(fs.readFileSync(usersFile, 'utf8')).users;
        const ua = stored.find(u => u.id === a.body.user.id);
        const ub = stored.find(u => u.id === b.body.user.id);
        assert.ok(ua.passwordHash);
        assert.notEqual(ua.passwordHash, ub.passwordHash);
        assert.equal(ua.password, undefined);
        assert.equal(a.body.user.passwordHash, undefined);
        assert.equal((await request('/api/users/login', 'POST', { email: 'a@example.test', password: 'wrong' })).status, 401);
        assert.equal((await request('/api/users/login', 'POST', { email: 'a@example.test', password: 'test-password' })).status, 200);
        assert.equal((await request('/api/users/login', 'POST', { email: 'legacy@example.test', password: 'legacy-test-only' })).status, 200);
        const legacy = JSON.parse(fs.readFileSync(usersFile, 'utf8')).users.find(u => u.id === 'legacy');
        assert.ok(legacy.passwordHash);
        assert.equal(legacy.password, undefined);
        assert.equal((await request('/api/users')).status, 401);
        assert.equal((await request('/api/users', 'GET', undefined, a.body.token)).status, 403);
        assert.equal((await request('/data/users.json')).status, 404);
        assert.equal((await request('/server.js')).status, 404);
        const route = '/api/calculations/' + a.body.user.id;
        assert.equal((await request(route)).status, 401);
        assert.equal((await request(route, 'GET', undefined, b.body.token)).status, 403);
        assert.equal((await request(route, 'GET', undefined, a.body.token + 'x')).status, 401);
        const calculation = { userId: a.body.user.id, calculationType: 'budget', calculationData: { income: 10 } };
        assert.equal((await request('/api/calculations/save', 'POST', calculation, b.body.token)).status, 403);
        const saved = await request('/api/calculations/save', 'POST', calculation, a.body.token);
        assert.equal(saved.status, 201);
        assert.equal((await request(route, 'GET', undefined, a.body.token)).body.calculations.length, 1);
        const deletion = '/api/calculations/' + saved.body.calculation.id;
        assert.equal((await request(deletion, 'DELETE', undefined, b.body.token)).status, 404);
        assert.equal((await request(deletion, 'DELETE', undefined, a.body.token)).status, 200);
        const browser = await request('/api/users/login', 'POST', { email: 'a@example.test', password: 'test-password' }, undefined, {'X-FinLit-Client':'browser'});
        assert.equal(browser.status, 200);
        assert.equal(browser.body.token, undefined);
        assert.match(browser.cookie, /HttpOnly/i);
        assert.match(browser.cookie, /SameSite=Strict/i);
        const cookie = browser.cookie.split(';')[0];
        const browserHeaders = {Cookie: cookie, 'X-FinLit-Client':'browser'};
        assert.equal((await request('/api/users/me', 'GET', undefined, undefined, browserHeaders)).body.user.id, a.body.user.id);
        assert.equal((await request('/api/calculations/save', 'POST', calculation, undefined, {Cookie:cookie})).status, 403);
        assert.equal((await request('/api/calculations/save', 'POST', calculation, undefined, {...browserHeaders,'Sec-Fetch-Site':'cross-site'})).status, 403);
        assert.equal((await request('/api/calculations/save', 'POST', {...calculation, calculationType:'invalid'}, undefined, browserHeaders)).status, 400);
        assert.equal((await request('/api/users/logout', 'POST', undefined, undefined, browserHeaders)).status, 200);
        assert.equal((await request('/api/users/me', 'GET', undefined, undefined, browserHeaders)).status, 401);
        assert.equal((await request('/api/users/logout', 'POST', undefined, a.body.token)).status, 200);
        assert.equal((await request(route, 'GET', undefined, a.body.token)).status, 401);
        assert.equal((await request('/.finlit-data/sessions.json')).status, 404);
        assert.equal((await request('/data/calculations.json')).status, 404);
        const sessions = JSON.parse(fs.readFileSync(path.join(dir,'sessions.json'),'utf8')).sessions;
        assert.ok(sessions.every(item => /^[a-f0-9]{64}$/.test(item.hash) && !item.token));
        let response;
        for (let i=0;i<12;i++) response = await request('/api/users/login','POST',{email:'unknown@example.test',password:'wrong-password'});
        assert.equal(response.status,429);

    } finally {
        await new Promise(resolve => server.close(resolve));
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
