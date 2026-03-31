const { Router } = require('express');
const { MENU_SECTIONS, MENU_ITEMS } = require('../data/menu');
const { success, failure } = require('../helpers/response');

const router = Router();

// GET /api/menu — list of top-level menu sections
router.get('/', (_req, res) => {
  res.json(success(MENU_SECTIONS));
});

// GET /api/menu/:id — items for a specific section
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const section = MENU_SECTIONS.find((s) => s.id === id);

  if (!section) {
    return res.status(404).json(failure('Menu section not found', 404, 'menu/not-found', 'ApiResponse'));
  }

  const items = MENU_ITEMS[id] ?? [];
  res.json(success({ ...section, items }));
});

module.exports = router;
