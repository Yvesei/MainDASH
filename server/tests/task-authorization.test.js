const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const calls = [];
const db = {
  task: {
    async findMany(args) { calls.push(['findMany', args]); return []; },
    async findUnique(args) { calls.push(['findUnique', args]); return { id: args.where.id, createdBy: 9 }; },
    async findFirst(args) { calls.push(['findFirst', args]); return null; },
    async updateMany(args) { calls.push(['updateMany', args]); return { count: 0 }; },
    async count(args) { calls.push(['count', args]); return 0; },
  },
};
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@prisma/client') return { PrismaClient: class { constructor() { return db; } } };
  return originalLoad.apply(this, arguments);
};
const router = require('../routes/tasks');
Module._load = originalLoad;

function handler(method, path) {
  const layer = router.stack.find(item => item.route && item.route.path === path && item.route.methods[method]);
  return layer.route.stack.at(-1).handle;
}
async function invoke(method, path, options = {}) {
  const req = { user: { id: 4, role: 'USER' }, query: {}, params: {}, body: {}, ...options };
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; }, send(data) { this.body = data; return this; }, sendStatus(code) { this.statusCode = code; return this; } };
  await handler(method, path)(req, res, error => { throw error; });
  return res;
}

test('task lists, counts and reports are scoped to the signed-in user', async () => {
  for (const [path, query] of [['/latest', {}], ['/', { clientId: '3' }], ['/countAll', {}], ['/calculate-total-time', { idArray: ['2', '9'] }]]) {
    calls.length = 0;
    await invoke('get', path, { query });
    assert.ok(calls.length > 0);
    for (const [, args] of calls) assert.equal(args.where.createdBy, 4, path);
  }
});

test('bulk completion cannot modify another user or archived tasks', async () => {
  calls.length = 0;
  await invoke('patch', '/markDone', { body: { idArray: [2, 9] } });
  const where = calls[0][1].where;
  assert.equal(where.createdBy, 4);
  assert.equal(where.deleted, false);
  assert.deepEqual(where.id.in, [2, 9]);
});

test('individual tasks cannot be read, edited, or archived by another user', async () => {
  assert.equal((await invoke('get', '/calculate-time-difference', { query: { id: '9' } })).statusCode, 404);
  assert.equal((await invoke('patch', '/', { body: { taskId: 9, name: 'Client' } })).statusCode, 404);
  assert.equal((await invoke('delete', '/:id', { params: { id: '9' } })).statusCode, 403);
});

test('admins can see all tasks', async () => {
  calls.length = 0;
  await invoke('get', '/latest', { user: { id: 1, role: 'ADMIN' } });
  assert.equal(calls[0][1].where.createdBy, undefined);
});

test('every task upload route rejects executable or disguised content', async () => {
  for (const path of ['/upload', '/uploadEdit', '/uploadSupply', '/uploadFileEdit']) {
    const res = await invoke('post', path, { files: { file: { name: 'fake.png', data: Buffer.from('<script>'), size: 8 } } });
    assert.equal(res.statusCode, 400, path);
  }
  const res = await invoke('post', '/uploadFileEdit', { files: { file: { name: 'evil.svg', data: Buffer.from('<svg>'), size: 5 } } });
  assert.equal(res.statusCode, 400);
});

test('only admins can request archived tasks in client reports', async () => {
  calls.length = 0;
  await invoke('get', '/', { query: { clientId: '3', includeHidden: 'true' } });
  assert.equal(calls[0][1].where.deleted, false);
  calls.length = 0;
  await invoke('get', '/', { user: { id: 1, role: 'ADMIN' }, query: { clientId: '3', includeHidden: 'true' } });
  assert.equal(calls[0][1].where.deleted, undefined);
});

test('date filters use exact instants and reject invalid bounds', async () => {
  calls.length = 0;
  const query = { filterStart: '2025-01-01T05:00:00.000Z', filterEndExclusive: '2025-01-02T05:00:00.000Z' };
  assert.equal((await invoke('get', '/latest', { query })).statusCode, 200);
  assert.equal(calls[0][1].where.Date.gte.toISOString(), query.filterStart);
  assert.equal(calls[0][1].where.Date.lt.toISOString(), query.filterEndExclusive);
  const invalid = await invoke('get', '/latest', { query: { filterStart: query.filterEndExclusive, filterEndExclusive: query.filterStart } });
  assert.equal(invalid.statusCode, 400);
});


test('pending filters include tasks with no status', async () => {
  calls.length = 0;
  await invoke('get', '/latest', { query: { type: 'Pending' } });
  assert.deepEqual(calls[0][1].where.OR, [{ status: false }, { status: null }]);
});
