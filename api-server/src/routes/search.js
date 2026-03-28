const { Router } = require('express');
const { CATALOGS, CATALOG_FILTER_ATTRIBUTES } = require('../data/search-filter-attributes');
const { success, failure } = require('../helpers/response');

const router = Router();

// GET /api/search/catalogs
router.get('/catalogs', (_req, res) => {
  res.json(success(CATALOGS));
});

/**
 * GET /api/search/filter-attributes/:catalogKey
 * Returns the filter attributes (with options) for a given catalog key.
 * catalogKey: 'for-you' | 'product' | 'content' | 'vacancies' |
 *             'people' | 'enterprise' | 'training' | 'news'
 */
router.get('/filter-attributes/:catalogKey', (req, res) => {
  const { catalogKey } = req.params;

  if (!(catalogKey in CATALOG_FILTER_ATTRIBUTES)) {
    return res.status(404).json(
      failure(`Catalog '${catalogKey}' not found`, 404, 'catalog-not-found', 'NotFound'),
    );
  }

  const attributes = CATALOG_FILTER_ATTRIBUTES[catalogKey];
  return res.json(success(attributes));
});

module.exports = router;
