const { Router } = require('express');
const { MOCK_COLLECTION_BUNDLES } = require('../data/collection-bundles');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/collection-bundle
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const category = req.query.category ? req.query.category.toLowerCase() : null;

  const source =
    category && category !== 'all'
      ? MOCK_COLLECTION_BUNDLES.filter(
          (b) =>
            Array.isArray(b.slang) &&
            b.slang.some((tag) => tag.toLowerCase() === category),
        )
      : MOCK_COLLECTION_BUNDLES;

  const start = (page - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, source.length)));
});

// GET /api/collection-bundle/:collectionNameKey
router.get('/:collectionNameKey', (req, res) => {
  const bundle = MOCK_COLLECTION_BUNDLES.find((b) => b.collectionNameKey === req.params.collectionNameKey);
  if (!bundle) return res.status(404).json({ error: 'Collection bundle not found' });
  res.json(success(bundle));
});

module.exports = router;
