const fs = require('node:fs');
const path = require('node:path');

const STORE_FILE = path.join(__dirname, 'resume-store.json');
const SEED_FILE = path.join(__dirname, 'resume-store.seed.json');

const TRACK_IDS = [
  'skills',
  'experience',
  'education',
  'languages',
  'certifications',
  'about',
  'contact',
  'pronoun_pcd',
  'media',
];

function emptyTracks() {
  const tracks = {};
  for (const id of TRACK_IDS) {
    tracks[id] = { status: 'empty', completion: 0, lastSavedAt: null };
  }
  return tracks;
}

function emptyPayload() {
  return {
    about: '',
    contact: { email: null, phone: null, city: null, country: null },
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    pronoun: null,
    isPcd: false,
    pcdNotes: null,
    avatarUrl: null,
    coverUrl: null,
  };
}

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    }
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    fs.writeFileSync(STORE_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  } catch (err) {
    console.error('[resume-draft] failed to load store, falling back to empty:', err.message);
    return {};
  }
}

function backfillDraft(handle, draft) {
  return {
    ownerHandle: draft.ownerHandle ?? handle,
    updatedAt: draft.updatedAt ?? new Date().toISOString(),
    isPublished: draft.isPublished ?? false,
    publishedAt: draft.publishedAt ?? null,
    tracks: { ...emptyTracks(), ...(draft.tracks ?? {}) },
    payload: { ...emptyPayload(), ...(draft.payload ?? {}) },
  };
}

const RESUME_DRAFTS = new Map();
for (const [handle, draft] of Object.entries(loadStore())) {
  RESUME_DRAFTS.set(handle, backfillDraft(handle, draft));
}

function persist() {
  try {
    const obj = Object.fromEntries(RESUME_DRAFTS.entries());
    fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('[resume-draft] failed to persist:', err.message);
  }
}

function ensureDraft(handle) {
  if (!RESUME_DRAFTS.has(handle)) {
    RESUME_DRAFTS.set(handle, {
      ownerHandle: handle,
      updatedAt: new Date().toISOString(),
      isPublished: false,
      publishedAt: null,
      tracks: emptyTracks(),
      payload: emptyPayload(),
    });
    persist();
  }
  return RESUME_DRAFTS.get(handle);
}

function computeCompletion(trackId, payload) {
  switch (trackId) {
    case 'skills':
      return payload.skills?.length ? Math.min(1, payload.skills.length / 3) : 0;
    case 'experience':
      return payload.experiences?.length ? 1 : 0;
    case 'education':
      return payload.educations?.length ? 1 : 0;
    case 'languages':
      return payload.languages?.length ? Math.min(1, payload.languages.length / 2) : 0;
    case 'certifications':
      return payload.certifications?.length ? 1 : 0;
    case 'about':
      return payload.about && payload.about.length >= 50 ? 1 : payload.about ? 0.5 : 0;
    case 'contact': {
      const c = payload.contact || {};
      const filled = ['email', 'phone', 'city', 'country'].filter((k) => !!c[k]).length;
      return filled / 4;
    }
    case 'pronoun_pcd':
      return payload.pronoun ? 1 : 0;
    case 'media': {
      const filled = (payload.avatarUrl ? 1 : 0) + (payload.coverUrl ? 1 : 0);
      return filled / 2;
    }
    default:
      return 0;
  }
}

function statusFromCompletion(completion) {
  if (completion >= 1) return 'completed';
  if (completion > 0) return 'in_progress';
  return 'empty';
}

module.exports = {
  TRACK_IDS,
  RESUME_DRAFTS,
  ensureDraft,
  computeCompletion,
  statusFromCompletion,
  persist,
};
