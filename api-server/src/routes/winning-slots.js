const { Router } = require('express');
const { MOCK_WINNING_SLOTS } = require('../data/winning-slots');
const { success, paginated } = require('../helpers/response');

const router = Router();

// GET /api/winning-slots
// Query params (todos opcionais):
//   - page, pageSize: paginação
//   - aspectRatio: '9:16' | '16:9' (filtra por shape do gap)
//   - contentType: 'movie' | 'image' | 'html' | 'component'
//   - slotKind:    'ad' | 'recommendation' | 'informative' | 'interactive'
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 40));
  const aspectRatio = req.query.aspectRatio || null;
  const contentType = req.query.contentType || null;
  const slotKind = req.query.slotKind || null;

  let source = MOCK_WINNING_SLOTS.filter((s) => !s.isBlocked && !s.isReported);

  if (aspectRatio) {
    source = source.filter((s) => s.media.aspectRatio === aspectRatio);
  }
  if (contentType) {
    source = source.filter((s) => s.media.contentType === contentType);
  }
  if (slotKind) {
    source = source.filter((s) => s.slotKind === slotKind);
  }

  const start = (page - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, source.length)));
});

module.exports = router;
