const { Router } = require('express');
const {
  listCampaigns,
  getCampaign,
  buildCalendar,
  projectionFor,
  createCampaign,
  cancelCampaign,
  ELIGIBLE_VIDEOS,
} = require('../data/campaigns');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// GET /api/v1/sponsored-campaigns/campaigns?status=&page=&pageSize=
router.get('/campaigns', (req, res) => {
  const { status } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 20));
  const result = listCampaigns({ status, page, pageSize });
  res.json(success(paginated(result.items, result.page, result.pageSize, result.total, { status })));
});

// GET /api/v1/sponsored-campaigns/campaigns/:id
router.get('/campaigns/:id', (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign) {
    return res.status(404).json(failure('Campanha não encontrada.', 404, 'campaigns/not-found'));
  }
  res.json(success(campaign));
});

// POST /api/v1/sponsored-campaigns/campaigns
router.post('/campaigns', (req, res) => {
  const { keyword, videoId, hours } = req.body || {};
  if (!keyword || !videoId) {
    return res
      .status(400)
      .json(failure('Informe palavra-chave e vídeo.', 400, 'campaigns/missing-fields'));
  }
  const result = createCampaign({ keyword, videoId, hours });
  if (!result.ok) {
    const map = {
      'video-not-found': ['Vídeo não encontrado.', 404],
      'video-ineligible': ['Vídeo não elegível para impulsionamento.', 403],
      'no-hours': ['Selecione ao menos uma hora.', 400],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `campaigns/${result.code}`));
  }
  res.json(success(result.campaign, 201, 'Campanha criada com sucesso.'));
});

// PATCH /api/v1/sponsored-campaigns/campaigns/:id/cancel
router.patch('/campaigns/:id/cancel', (req, res) => {
  const result = cancelCampaign(req.params.id);
  if (!result.ok) {
    const map = {
      'not-found': ['Campanha não encontrada.', 404],
      'not-cancellable': ['Campanha não pode ser cancelada.', 409],
    };
    const [message, status] = map[result.code] || ['Erro desconhecido.', 500];
    return res.status(status).json(failure(message, status, `campaigns/${result.code}`));
  }
  res.json(success(result.campaign, 200, 'Campanha cancelada.'));
});

// GET /api/v1/sponsored-campaigns/pricing-calendar?keyword=&from=
router.get('/pricing-calendar', (req, res) => {
  const { keyword = '', from } = req.query;
  const start = from ? from : new Date().toISOString().slice(0, 10);
  res.json(success(buildCalendar(keyword, start)));
});

// GET /api/v1/sponsored-campaigns/eligible-videos
router.get('/eligible-videos', (_req, res) => {
  res.json(success(ELIGIBLE_VIDEOS));
});

// POST /api/v1/sponsored-campaigns/projection
router.post('/projection', (req, res) => {
  const { keyword, videoId, hours } = req.body || {};
  res.json(success(projectionFor({ keyword: keyword || '', videoId, hours: hours || [] })));
});

module.exports = router;
