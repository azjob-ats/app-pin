const { Router } = require('express');
const { MOCK_PINS, MOCK_PIN_DETAIL, generatePins } = require('../data/pins');
const { generateCommentsForPin } = require('../data/comments');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// GET /api/pins — paginated list
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const search = req.query.search?.toLowerCase();

  let pins = [...MOCK_PINS];

  if (search) {
    pins = pins.filter(
      (p) =>
        p.title?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.tags?.some((t) => t.toLowerCase().includes(search)),
    );
  }

  const totalRecords = pins.length;
  const start = (page - 1) * pageSize;
  const items = pins.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, totalRecords, { search: search ?? null })));
});

// GET /api/pins/feed — infinite scroll feed
router.get('/feed', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const startIndex = (page - 1) * pageSize;

  const items = generatePins(pageSize, startIndex);
  const totalRecords = pageSize * 10;

  res.json(success(paginated(items, page, pageSize, totalRecords)));
});

// GET /api/pins/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (id === MOCK_PIN_DETAIL.id) {
    return res.json(success(MOCK_PIN_DETAIL));
  }

  const pin = MOCK_PINS.find((p) => p.id === id);
  if (!pin) {
    return res.status(404).json(failure('Pin not found', 404, 'pins/not-found', 'ApiResponse'));
  }

  res.json(success(pin));
});

// GET /api/pins/:id/comments
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  const pageSize = Math.min(20, Math.max(1, parseInt(req.query.pageSize) || 10));
  const page = Math.max(1, parseInt(req.query.page) || 1);

  const comments = generateCommentsForPin(id, pageSize);
  res.json(success(paginated(comments, page, pageSize, pageSize)));
});

// GET /api/pins/:id/related
router.get('/:id/related', (req, res) => {
  const pageSize = Math.min(20, Math.max(1, parseInt(req.query.pageSize) || 8));
  const related = generatePins(pageSize, Math.floor(Math.random() * 60));
  res.json(success(paginated(related, 1, pageSize, pageSize)));
});

// POST /api/pins/:id/save — toggle save
router.post('/:id/save', (req, res) => {
  const { id } = req.params;
  const pin = MOCK_PINS.find((p) => p.id === id);

  if (!pin) {
    return res.status(404).json(failure('Pin not found', 404, 'pins/not-found', 'ApiResponse'));
  }

  pin.isSaved = !pin.isSaved;
  pin.saveCount += pin.isSaved ? 1 : -1;

  res.json(success({ isSaved: pin.isSaved, saveCount: pin.saveCount }));
});

// POST /api/pins/:id/comments — add comment
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json(failure('Comment text is required', 400, 'pins/comment-required', 'ApiResponse'));
  }

  const comment = {
    id: `comment-${id}-${Date.now()}`,
    text: text.trim(),
    author: { id: 'current', username: 'myprofile', displayName: 'Meu Perfil', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
    pinId: id,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isLiked: false,
  };

  res.status(201).json(success(comment, 201, 'Comment created'));
});

module.exports = router;
