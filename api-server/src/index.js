const express = require('express');
const cors = require('cors');

const pinsRouter = require('./routes/pins');
const usersRouter = require('./routes/users');
const boardsRouter = require('./routes/daily-story');
const notificationsRouter = require('./routes/notifications');
const contentCategoryRouter = require('./routes/content-category');
const relevantResearchRouter = require('./routes/relevant-research');
const searchRouter = require('./routes/search');
const menuRouter = require('./routes/menu');
const learnMoreRouter = require('./routes/learn-more');
const postRouter = require('./routes/post');
const collectionBundleRouter = require('./routes/collection-bundle');
const channelRouter = require('./routes/channel');
const shopWindowRouter = require('./routes/shop-window');
const winningSlotsRouter = require('./routes/winning-slots');
const creatorPortfolioRouter = require('./routes/creator-portfolio');
const inscriptionsRouter = require('./routes/inscriptions');
const metricsRouter = require('./routes/metrics');
const sponsoredCampaignsRouter = require('./routes/campaigns');
const resumeRouter = require('./routes/resume');
const empresaRouter = require('./routes/empresa');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simulate network latency (optional, set MOCK_DELAY=ms to enable)
if (process.env.MOCK_DELAY) {
  const delay = parseInt(process.env.MOCK_DELAY) || 300;
  app.use((_req, _res, next) => setTimeout(next, delay));
}

app.use('/api/menu', menuRouter);
app.use('/api/v1/learn-more', learnMoreRouter);
app.use('/api/pins', pinsRouter);
app.use('/api/users', usersRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/content-category', contentCategoryRouter);
app.use('/api/relevant-research', relevantResearchRouter);
app.use('/api/search', searchRouter);
app.use('/api/post', postRouter);
app.use('/api/collection-bundle', collectionBundleRouter);
app.use('/api/channel', channelRouter);
app.use('/api/shop-window', shopWindowRouter);
app.use('/api/winning-slots', winningSlotsRouter);
app.use('/api/v1/creator-portfolio', creatorPortfolioRouter);
app.use('/api/v1/me/inscriptions', inscriptionsRouter);
app.use('/api/v1/me/metrics', metricsRouter);
app.use('/api/v1/sponsored-campaigns', sponsoredCampaignsRouter);
app.use('/api/v1/me/resume', resumeRouter);
app.use('/api/v1/empresa', empresaRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /api/pins');
  console.log('  GET    /api/pins/feed');
  console.log('  GET    /api/pins/:id');
  console.log('  GET    /api/pins/:id/related');
  console.log('  GET    /api/pins/:id/comments');
  console.log('  POST   /api/pins/:id/save');
  console.log('  POST   /api/pins/:id/comments');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/me');
  console.log('  GET    /api/users/:id');
  console.log('  GET    /api/users/:id/pins');
  console.log('  GET    /api/users/:id/boards');
  console.log('  POST   /api/users/:id/follow');
  console.log('  GET    /api/boards');
  console.log('  GET    /api/boards/:id');
  console.log('  GET    /api/boards/:id/pins');
  console.log('  GET    /api/notifications');
  console.log('  PATCH  /api/notifications/:id/read');
  console.log('  POST   /api/notifications/read-all');
  console.log('  GET    /api/content-category');
  console.log('  GET    /api/relevant-research');
  console.log('  GET    /api/search/catalogs');
  console.log('  GET    /api/search/filter-attributes/:catalogKey');
  console.log('  GET    /api/menu');
  console.log('  GET    /api/menu/:id');
  console.log('  GET    /api/v1/learn-more/:pinId');
  console.log('  POST   /api/v1/learn-more/:pinId/submit');
  console.log('  GET    /api/post');
  console.log('  GET    /api/post/:username/:titleLink');
  console.log('  GET    /api/collection-bundle');
  console.log('  GET    /api/collection-bundle/:id');
  console.log('  GET    /api/channel/:profileName');
  console.log('  GET    /api/channel/:profileName/gallery');
  console.log('  GET    /api/channel/:profileName/collection');
  console.log('  GET    /api/shop-window');
  console.log('  GET    /api/winning-slots');
  console.log('  GET    /api/v1/creator-portfolio/:handle');
  console.log('  GET    /api/v1/me/inscriptions');
  console.log('  PATCH  /api/v1/me/inscriptions/:id/cancel');
  console.log('  GET    /api/v1/me/metrics');
  console.log('  GET    /api/v1/sponsored-campaigns/campaigns');
  console.log('  GET    /api/v1/sponsored-campaigns/campaigns/:id');
  console.log('  POST   /api/v1/sponsored-campaigns/campaigns');
  console.log('  PATCH  /api/v1/sponsored-campaigns/campaigns/:id/cancel');
  console.log('  GET    /api/v1/sponsored-campaigns/pricing-calendar');
  console.log('  GET    /api/v1/sponsored-campaigns/eligible-videos');
  console.log('  POST   /api/v1/sponsored-campaigns/projection');
  console.log('  GET    /api/v1/me/resume');
  console.log('  PATCH  /api/v1/me/resume/:trackId');
  console.log('  POST   /api/v1/me/resume/publish');
  console.log('  GET    /api/v1/empresa/organizations');
  console.log('  POST   /api/v1/empresa/organizations');
  console.log('  GET    /api/v1/empresa/organizations/:slug');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/favorite');
  console.log('  GET    /api/v1/empresa/organizations/:slug/products');
  console.log('  POST   /api/v1/empresa/organizations/:slug/products');
  console.log('  GET    /api/v1/empresa/organizations/:slug/products/:id');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/products/:id');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/products/:id/move');
  console.log('  POST   /api/v1/empresa/organizations/:slug/products/:id/submissions');
  console.log('  GET    /api/v1/empresa/organizations/:slug/submissions');
  console.log('  GET    /api/v1/empresa/organizations/:slug/submissions/:id');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/submissions/:id/move');
  console.log('  POST   /api/v1/empresa/organizations/:slug/submissions/:id/notes');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/submissions/:id/assign');
  console.log('  GET    /api/v1/empresa/organizations/:slug/members');
  console.log('  POST   /api/v1/empresa/organizations/:slug/members/invite');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/members/:id');
  console.log('  GET    /api/v1/empresa/organizations/:slug/roles');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/roles/:id');
  console.log('  GET    /api/v1/empresa/organizations/:slug/groups');
  console.log('  POST   /api/v1/empresa/organizations/:slug/groups');
  console.log('  PATCH  /api/v1/empresa/organizations/:slug/groups/:id');
  console.log('  POST   /api/v1/empresa/organizations/:slug/groups/:id/members');
});
