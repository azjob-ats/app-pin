const { Router } = require('express');
const {
  TRACK_IDS,
  ensureDraft,
  computeCompletion,
  statusFromCompletion,
  persist,
} = require('../data/resume-draft');
const { findByHandle, MOCK_CREATOR_PORTFOLIOS } = require('../data/creator-portfolio');
const { success, failure } = require('../helpers/response');

const router = Router();
const CURRENT_USER_HANDLE = 'currentuser';

// GET /api/v1/me/resume
router.get('/', (_req, res) => {
  const draft = ensureDraft(CURRENT_USER_HANDLE);
  res.json(success(draft));
});

// PATCH /api/v1/me/resume/:trackId — auto-save por trilho
router.patch('/:trackId', (req, res) => {
  const { trackId } = req.params;
  if (!TRACK_IDS.includes(trackId)) {
    return res
      .status(400)
      .json(failure('Invalid trackId', 400, 'resume/invalid-track', 'ApiResponse'));
  }

  const draft = ensureDraft(CURRENT_USER_HANDLE);
  const incoming = req.body || {};

  // merge raso por chave de payload
  for (const key of Object.keys(incoming)) {
    if (key in draft.payload) {
      draft.payload[key] = incoming[key];
    }
  }

  const completion = computeCompletion(trackId, draft.payload);
  const now = new Date().toISOString();
  draft.tracks[trackId] = {
    status: statusFromCompletion(completion),
    completion,
    lastSavedAt: now,
  };
  draft.updatedAt = now;

  persist();

  res.json(success(draft, 200, 'Trilho salvo.'));
});

// POST /api/v1/me/resume/publish
router.post('/publish', (_req, res) => {
  const draft = ensureDraft(CURRENT_USER_HANDLE);
  const completed = Object.values(draft.tracks).filter((t) => t.status === 'completed').length;

  if (completed < 5) {
    return res
      .status(409)
      .json(
        failure(
          `Conclua ao menos 5 trilhos para publicar (atual: ${completed}/8).`,
          409,
          'resume/insufficient-completion',
          'ApiResponse',
        ),
      );
  }

  const now = new Date().toISOString();
  draft.isPublished = true;
  draft.publishedAt = now;
  draft.updatedAt = now;

  // espelha o draft no portfólio público (mesmo agregado)
  const existing = findByHandle(CURRENT_USER_HANDLE);
  const portfolio = existing || {
    handle: CURRENT_USER_HANDLE,
    displayName: 'Você',
    headline: 'Creator publicado',
    avatarUrl: 'https://i.pravatar.cc/240?img=10',
    coverUrl: 'https://picsum.photos/seed/currentuser-cover/1600/520',
    pronoun: null,
    isPcd: false,
    pcdNotes: null,
    contact: { email: null, phone: null, city: null, country: null },
    metrics: {
      totalContents: 0,
      averageRetention: 0,
      conversionRate: 0,
      rankingVertical: null,
      totalViews: 0,
    },
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    highlights: [],
    community: { followers: 0, supportsDM: false },
    socials: [],
    isPublished: true,
    about: '',
  };

  const merged = {
    ...portfolio,
    username: draft.payload.handle || portfolio.username || null,
    displayName: draft.payload.displayName || portfolio.displayName,
    headline: draft.payload.headline || portfolio.headline,
    about: draft.payload.about,
    pronoun: draft.payload.pronoun,
    isPcd: draft.payload.isPcd,
    pcdNotes: draft.payload.pcdNotes,
    contact: draft.payload.contact,
    experiences: draft.payload.experiences,
    educations: draft.payload.educations,
    skills: draft.payload.skills,
    languages: draft.payload.languages,
    certifications: draft.payload.certifications,
    avatarUrl: draft.payload.avatarUrl || portfolio.avatarUrl,
    coverUrl: draft.payload.coverUrl || portfolio.coverUrl,
    isPublished: true,
  };

  if (!existing) {
    MOCK_CREATOR_PORTFOLIOS.push(merged);
  } else {
    Object.assign(existing, merged);
  }

  persist();

  res.json(success(merged, 200, 'Portfólio publicado.'));
});

module.exports = router;
