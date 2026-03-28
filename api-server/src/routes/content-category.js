const { Router } = require('express');
const { MOCK_CATEGORIES } = require('../data/home');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/content-category
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 40));

  res.json(success(paginated(MOCK_CATEGORIES, page, pageSize, MOCK_CATEGORIES.length)));
});

module.exports = router;
