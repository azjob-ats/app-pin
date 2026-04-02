const { Router } = require('express');
const { LEARN_MORE_CONFIG } = require('../data/learn-more');
const { success, failure } = require('../helpers/response');

const router = Router();

// GET /api/v1/learn-more/:pinId — fetch questionnaire config for a pin
router.get('/:pinId', (req, res) => {
  const { pinId } = req.params;

  if (!pinId) {
    return res.status(400).json(failure('pinId is required', 400, 'learn-more/invalid-pin', 'ApiResponse'));
  }

  res.json(success(LEARN_MORE_CONFIG));
});

// POST /api/v1/learn-more/:pinId/submit — submit application
router.post('/:pinId/submit', (req, res) => {
  const { pinId } = req.params;
  const { fields } = req.body;

  if (!pinId) {
    return res.status(400).json(failure('pinId is required', 400, 'learn-more/invalid-pin', 'ApiResponse'));
  }

  if (!Array.isArray(fields)) {
    return res.status(400).json(failure('fields must be an array', 400, 'learn-more/invalid-payload', 'ApiResponse'));
  }

  res.json(success({ pinId, submittedAt: new Date().toISOString() }, 200, 'Candidatura enviada com sucesso.'));
});

module.exports = router;
