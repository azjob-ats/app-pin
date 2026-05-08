const { Router } = require('express');
const { MOCK_INSCRIPTIONS } = require('../data/inscriptions');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// in-memory state (reset on server restart)
const STATE = MOCK_INSCRIPTIONS.map((item) => ({ ...item }));

// GET /api/v1/me/inscriptions?type=&status=&from=&to=&page=&pageSize=
router.get('/', (req, res) => {
  const { type, status, from, to } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 20));

  let filtered = STATE.slice();
  if (type) filtered = filtered.filter((i) => i.type === type);
  if (status) filtered = filtered.filter((i) => i.status === status);
  if (from) {
    const fromDate = new Date(from).getTime();
    if (!Number.isNaN(fromDate)) {
      filtered = filtered.filter((i) => new Date(i.submittedAt).getTime() >= fromDate);
    }
  }
  if (to) {
    const toDate = new Date(to).getTime();
    if (!Number.isNaN(toDate)) {
      filtered = filtered.filter((i) => new Date(i.submittedAt).getTime() <= toDate);
    }
  }

  filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, filtered.length, { type, status, from, to })));
});

// PATCH /api/v1/me/inscriptions/:id/cancel
router.patch('/:id/cancel', (req, res) => {
  const { id } = req.params;
  const inscription = STATE.find((i) => i.id === id);
  if (!inscription) {
    return res
      .status(404)
      .json(failure('Inscription not found', 404, 'inscriptions/not-found', 'ApiResponse'));
  }
  if (!inscription.cancellable) {
    return res
      .status(409)
      .json(
        failure('Inscription cannot be cancelled', 409, 'inscriptions/not-cancellable', 'ApiResponse'),
      );
  }

  inscription.status = 'cancelled';
  inscription.cancellable = false;
  inscription.nextStep = null;
  inscription.updatedAt = new Date().toISOString();

  res.json(success(inscription, 200, 'Inscrição cancelada com sucesso.'));
});

module.exports = router;
