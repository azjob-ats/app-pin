const { Router } = require('express');
const { MOCK_BOARDS } = require('../data/boards');
const { generatePins } = require('../data/pins');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// GET /api/boards — list boards
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const search = req.query.search?.toLowerCase();

  let boards = [...MOCK_BOARDS];
  if (search) {
    boards = boards.filter((b) => b.name.toLowerCase().includes(search));
  }

  res.json(success(paginated(boards, page, pageSize, boards.length, { search: search ?? null })));
});

// GET /api/boards/:id
router.get('/:id', (req, res) => {
  const board = MOCK_BOARDS.find((b) => b.id === req.params.id);
  if (!board) {
    return res.status(404).json(failure('Board not found', 404, 'boards/not-found', 'ApiResponse'));
  }
  res.json(success(board));
});

// GET /api/boards/:id/pins
router.get('/:id/pins', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const startIndex = (page - 1) * pageSize;

  const pins = generatePins(pageSize, startIndex);
  const totalRecords = pageSize * 5;

  res.json(success(paginated(pins, page, pageSize, totalRecords)));
});

module.exports = router;
