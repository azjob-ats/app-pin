const { Router } = require('express');
const { MOCK_CHANNEL } = require('../data/channel');
const { MOCK_GALLERY } = require('../data/gallery');
const { MOCK_COLLECTION_BUNDLES } = require('../data/collection-bundles');
const { success, paginated } = require('../helpers/response');

const router = Router();

function findChannel(profileName) {
  const target = profileName.toLowerCase();
  return MOCK_CHANNEL.find(
    (c) => c.profileName.toLowerCase() === target || c.id === profileName,
  );
}

// GET /api/channel/:profileName
router.get('/:profileName', (req, res) => {
  const channel = findChannel(req.params.profileName);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  res.json(success(channel));
});

// GET /api/channel/:profileName/gallery
router.get('/:profileName/gallery', (req, res) => {
  const channel = findChannel(req.params.profileName);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));

  const source = MOCK_GALLERY.filter(
    (post) => post.channel?.id === channel.id,
  );
  const start = (page - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, source.length)));
});

// GET /api/channel/:profileName/collection
router.get('/:profileName/collection', (req, res) => {
  const channel = findChannel(req.params.profileName);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));

  const target = channel.profileName.toLowerCase();
  const source = MOCK_COLLECTION_BUNDLES.filter(
    (bundle) =>
      bundle.username?.toLowerCase() === target ||
      bundle.channel?.toLowerCase() === target,
  );
  const start = (page - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, source.length)));
});

module.exports = router;
