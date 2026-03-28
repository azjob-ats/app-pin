const { Router } = require('express');
const { MOCK_POPULAR_SEARCHES } = require('../data/home');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/relevant-research
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));

  res.json(success(paginated(MOCK_POPULAR_SEARCHES, page, pageSize, MOCK_POPULAR_SEARCHES.length)));
});

module.exports = router;
