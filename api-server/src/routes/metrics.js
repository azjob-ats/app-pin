const { Router } = require('express');
const { buildOverview } = require('../data/metrics');
const { success } = require('../helpers/response');

const router = Router();
const VALID_PERIODS = new Set(['7d', '30d', '90d', 'all']);

// GET /api/v1/me/metrics?period=7d|30d|90d|all
router.get('/', (req, res) => {
  const rawPeriod = (req.query.period || '').toString();
  const period = VALID_PERIODS.has(rawPeriod) ? rawPeriod : '30d';
  res.json(success(buildOverview(period), 200, 'Métricas carregadas com sucesso.'));
});

module.exports = router;
