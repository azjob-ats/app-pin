const { Router } = require('express');
const { MOCK_POSTS } = require('../data/posts');
const { MOCK_POPULAR_SEARCHES } = require('../data/popular-searches');
const { success, paginated } = require('../helpers/response');

const router = Router();

function uniqueById(posts) {
  const seen = new Set();
  return posts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

// GET /api/post
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const category = req.query.category ? req.query.category.toLowerCase() : null;
  const search = req.query.search ? req.query.search.trim() : null;

  let source;

  if (search) {
    // Exact post ID match → return only that post
    const exactMatch = MOCK_POSTS.find((p) => p.id === search);
    if (exactMatch) {
      source = [exactMatch];
    } else {
      const term = search.toLowerCase();

      // Organically: curated posts from popular-searches entry matching the term
      const popularEntry = MOCK_POPULAR_SEARCHES.find(
        (e) => e.term.toLowerCase() === term,
      );
      const organicIds = popularEntry ? popularEntry.organically.map((o) => o.id) : [];
      const organicResults = organicIds.length
        ? MOCK_POSTS.filter((p) => organicIds.includes(p.id))
        : [];

      // Textual: posts whose title, description or slang contains the term
      const textResults = MOCK_POSTS.filter(
        (p) =>
          p.media.title?.toLowerCase().includes(term) ||
          p.media.description?.toLowerCase().includes(term) ||
          (Array.isArray(p.media.slang) &&
            p.media.slang.some((s) => s.toLowerCase().includes(term))),
      );

      // Merge: organically first (higher relevance), then text results; deduplicate
      source = uniqueById([...organicResults, ...textResults]);
    }
  } else if (category && category !== 'all') {
    source = MOCK_POSTS.filter(
      (p) =>
        Array.isArray(p.media.slang) &&
        p.media.slang.some((tag) => tag.toLowerCase() === category),
    );
  } else {
    source = MOCK_POSTS;
  }

  const start = (page - 1) * pageSize;
  const items = source.slice(start, start + pageSize);

  res.json(success(paginated(items, page, pageSize, source.length)));
});

// GET /api/post/:id
router.get('/:id', (req, res) => {
  const post = MOCK_POSTS.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(success(post));
});

module.exports = router;
