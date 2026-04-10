const { Router } = require('express');
const { MOCK_POSTS } = require('../data/posts');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/post
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const start = (page - 1) * pageSize;
  const items = MOCK_POSTS.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, MOCK_POSTS.length)));
});

// GET /api/post/:id
router.get('/:id', (req, res) => {
  const post = MOCK_POSTS.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(success(post));
});

module.exports = router;
