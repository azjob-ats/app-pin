const { Router } = require('express');
const { MOCK_USERS, MOCK_CURRENT_USER } = require('../data/users');
const { MOCK_BOARDS } = require('../data/boards');
const { generatePins } = require('../data/pins');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// GET /api/users/me — current user
router.get('/me', (req, res) => {
  res.json(success(MOCK_CURRENT_USER));
});

// GET /api/users — list users
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const search = req.query.search?.toLowerCase();

  let users = [...MOCK_USERS];
  if (search) {
    users = users.filter(
      (u) =>
        u.username.toLowerCase().includes(search) ||
        u.displayName.toLowerCase().includes(search),
    );
  }

  res.json(success(paginated(users, page, pageSize, users.length, { search: search ?? null })));
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'me' || id === MOCK_CURRENT_USER.id) {
    return res.json(success(MOCK_CURRENT_USER));
  }

  const user = MOCK_USERS.find((u) => u.id === id || u.username === id);
  if (!user) {
    return res.status(404).json(failure('User not found', 404, 'users/not-found', 'ApiResponse'));
  }

  res.json(success(user));
});

// GET /api/users/:id/pins
router.get('/:id/pins', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const startIndex = (page - 1) * pageSize;

  const pins = generatePins(pageSize, startIndex);
  const totalRecords = pageSize * 5;

  res.json(success(paginated(pins, page, pageSize, totalRecords)));
});

// GET /api/users/:id/boards
router.get('/:id/boards', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const boards = MOCK_BOARDS.slice(0, 6);

  res.json(success(paginated(boards, page, pageSize, boards.length)));
});

// POST /api/users/:id/follow — toggle follow
router.post('/:id/follow', (req, res) => {
  const { id } = req.params;
  const user = MOCK_USERS.find((u) => u.id === id || u.username === id);

  if (!user) {
    return res.status(404).json(failure('User not found', 404, 'users/not-found', 'ApiResponse'));
  }

  user.isFollowing = !user.isFollowing;
  user.followersCount += user.isFollowing ? 1 : -1;

  res.json(success({ isFollowing: user.isFollowing, followersCount: user.followersCount }));
});

module.exports = router;
