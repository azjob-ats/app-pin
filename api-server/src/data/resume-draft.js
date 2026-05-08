const TRACK_IDS = [
  'skills',
  'experience',
  'education',
  'languages',
  'certifications',
  'about',
  'contact',
  'pronoun_pcd',
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
  };
}

function buildSeedDraft() {
  const tracks = emptyTracks();
  const now = new Date().toISOString();

  tracks.about = { status: 'completed', completion: 1, lastSavedAt: now };
  tracks.skills = { status: 'completed', completion: 1, lastSavedAt: now };
  tracks.contact = { status: 'in_progress', completion: 0.5, lastSavedAt: now };
  tracks.languages = { status: 'in_progress', completion: 0.66, lastSavedAt: now };

  return {
    ownerHandle: 'currentuser',
    updatedAt: now,
    isPublished: false,
    publishedAt: null,
    tracks,
    payload: {
      about:
        'Profissional explorando o uso de mídia profissional como currículo vivo. Curioso sobre design e produto.',
      contact: {
        email: 'me@realwe.dev',
        phone: null,
        city: 'São Paulo',
        country: 'Brasil',
      },
      experiences: [],
      educations: [],
      skills: ['TypeScript', 'Angular', 'UX'],
      languages: [
        { id: 'lan1', name: 'Português', proficiency: 'native' },
        { id: 'lan2', name: 'Inglês', proficiency: 'intermediate' },
      ],
      certifications: [],
      pronoun: 'ele/dele',
      isPcd: false,
      pcdNotes: null,
    },
  };
}

const RESUME_DRAFTS = new Map();
RESUME_DRAFTS.set('currentuser', buildSeedDraft());

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
};
