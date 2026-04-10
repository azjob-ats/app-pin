const express = require('express');
const cors = require('cors');

const pinsRouter = require('./routes/pins');
const usersRouter = require('./routes/users');
const boardsRouter = require('./routes/boards');
const notificationsRouter = require('./routes/notifications');
const contentCategoryRouter = require('./routes/content-category');
const relevantResearchRouter = require('./routes/relevant-research');
const searchRouter = require('./routes/search');
const menuRouter = require('./routes/menu');
const learnMoreRouter = require('./routes/learn-more');
const postRouter = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
  console.log('  GET    /api/post/:id');
});
