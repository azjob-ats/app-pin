const { Router } = require('express');
const { findByHandle } = require('../data/creator-portfolio');
const { RESUME_DRAFTS } = require('../data/resume-draft');
const { success, failure } = require('../helpers/response');

const router = Router();

// Mescla os campos do draft publicado em cima do portfolio (mesmo
// agregado usado pelo POST /me/resume/publish). Usado para hidratar
// o currentuser entre restarts, já que o MOCK_CREATOR_PORTFOLIOS
// é estático mas o resume-store é persistido.
function hydrateFromPublishedDraft(portfolio) {
  const draft = RESUME_DRAFTS.get(portfolio.handle);
  if (!draft || !draft.isPublished) return portfolio;

  const p = draft.payload || {};
  return {
    ...portfolio,
    username: p.handle || portfolio.username || null,
    displayName: p.displayName || portfolio.displayName,
    headline: p.headline || portfolio.headline,
    about: p.about ?? portfolio.about,
    pronoun: p.pronoun ?? portfolio.pronoun,
    isPcd: p.isPcd ?? portfolio.isPcd,
    pcdNotes: p.pcdNotes ?? portfolio.pcdNotes,
    contact: p.contact ?? portfolio.contact,
    experiences: p.experiences ?? portfolio.experiences,
    educations: p.educations ?? portfolio.educations,
    skills: p.skills ?? portfolio.skills,
    languages: p.languages ?? portfolio.languages,
    certifications: p.certifications ?? portfolio.certifications,
    avatarUrl: p.avatarUrl || portfolio.avatarUrl,
    coverUrl: p.coverUrl || portfolio.coverUrl,
    isPublished: true,
  };
}

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

  res.json(success(hydrateFromPublishedDraft(portfolio)));
});

module.exports = router;
