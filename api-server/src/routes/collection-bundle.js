const { Router } = require('express');
const { MOCK_COLLECTION_BUNDLES } = require('../data/collection-bundles');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/collection-bundle
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const start = (page - 1) * pageSize;
  const items = MOCK_COLLECTION_BUNDLES.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, MOCK_COLLECTION_BUNDLES.length)));
});

// GET /api/collection-bundle/:id
router.get('/:id', (req, res) => {
  const bundle = MOCK_COLLECTION_BUNDLES.find((b) => b.id === req.params.id);
  if (!bundle) return res.status(404).json({ error: 'Collection bundle not found' });
  res.json(success(bundle));
});

module.exports = router;
