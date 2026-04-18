const { Router } = require('express');
const { MOCK_SHOP_WINDOW } = require('../data/shop-window');
const { success, paginated } = require('../helpers/response');

const router = Router();

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));

  const start = (page - 1) * pageSize;
  const items = MOCK_SHOP_WINDOW.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, MOCK_SHOP_WINDOW.length)));
});

module.exports = router;
