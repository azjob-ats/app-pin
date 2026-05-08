const { Router } = require('express');
const { findByHandle } = require('../data/creator-portfolio');
const { success, failure } = require('../helpers/response');

const router = Router();

// GET /api/v1/creator-portfolio/:handle
router.get('/:handle', (req, res) => {
  const { handle } = req.params;
  if (!handle) {
    return res
      .status(400)
      .json(failure('handle is required', 400, 'creator-portfolio/invalid-handle', 'ApiResponse'));
  }

  const portfolio = findByHandle(handle);
  if (!portfolio) {
    return res
      .status(404)
      .json(failure('Creator not found', 404, 'creator-portfolio/not-found', 'ApiResponse'));
  }

  res.json(success(portfolio));
});

module.exports = router;
