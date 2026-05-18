// Pricing rules per hour-of-day band:
//   21h–05h (overnight) = low
//   06h–13h (morning)   = high
//   14h–20h (afternoon) = medium
// Pricing rules per day-of-month band:
//   01–09 = high
//   10–25 = low
//   26–31 = medium
// Backend exposes the FINAL price per (date, hour) — frontend just renders.

const HOUR_BANDS = (hour) => {
  if (hour >= 21 || hour <= 5) return { band: 'low', factor: 1 };
  if (hour >= 6 && hour <= 13) return { band: 'high', factor: 2.4 };
  return { band: 'medium', factor: 1.5 }; // 14h-20h
};

const DAY_BANDS = (day) => {
  if (day >= 1 && day <= 9) return { band: 'high', factor: 1.6 };
  if (day >= 26) return { band: 'medium', factor: 1.2 };
  return { band: 'low', factor: 1 }; // 10-25
};

const BASE_PRICE = 250;

function priceFor(date, hour) {
  const h = HOUR_BANDS(hour);
  const d = DAY_BANDS(date.getDate());
  return Math.round(BASE_PRICE * h.factor * d.factor);
}

function statusFor(dateStr, hour) {
  // Deterministic pseudo-random distribution: ~6% reserved, ~3% sold
  const seed = dateStr
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  const mix = (seed + hour * 17) % 100;
  if (mix < 3) return 'sold';
  if (mix < 9) return 'reserved';
  return 'available';
}

function buildCalendar(keyword, fromIso) {
  const from = new Date(fromIso);
  from.setUTCHours(0, 0, 0, 0);
  const days = [];

  for (let i = 0; i < 31; i += 1) {
    const day = new Date(from);
    day.setUTCDate(from.getUTCDate() + i);
    const dateStr = day.toISOString().slice(0, 10);
    const hours = [];
    for (let h = 0; h < 24; h += 1) {
      hours.push({
        hour: h,
        price: priceFor(day, h),
        status: statusFor(dateStr, h),
      });
    }
    days.push({ date: day.toISOString(), hours });
  }

  const to = new Date(from);
  to.setUTCDate(from.getUTCDate() + 30);

  return {
    keyword,
    from: from.toISOString(),
    to: to.toISOString(),
    days,
  };
}

// In-memory campaigns store

const PARTY_AMANDA = {
  id: 'vid-001',
  title: 'Como nasceu o time de design do Nubank',
  thumbnailUrl: 'https://picsum.photos/seed/met-001/640/360',
  creatorName: 'Amanda Silva',
  channelName: 'Nubank',
};

const PARTY_LUCAS = {
  id: 'vid-002',
  title: 'O processo que reduziu nosso churn em 30%',
  thumbnailUrl: 'https://picsum.photos/seed/met-002/640/360',
  creatorName: 'Lucas Pereira',
  channelName: 'Digix',
};

const PARTY_BRUNA = {
  id: 'vid-003',
  title: 'Bastidores: nossa primeira contratação remota',
  thumbnailUrl: 'https://picsum.photos/seed/met-003/640/360',
  creatorName: 'Amanda Silva',
  channelName: 'Itaú',
};

const MOCK_CARD = {
  brand: 'Visa',
  last4: '4242',
  expirationMonth: 12,
  expirationYear: 2028,
  holderName: 'Nubank S.A.',
};

function buildMockCampaign({
  id,
  keyword,
  status,
  video,
  daysOffset,
  hoursPerDay,
  windowDays,
  performance,
  card,
}) {
  const today = new Date('2026-05-17T00:00:00Z');
  const windowFrom = new Date(today);
  windowFrom.setUTCDate(today.getUTCDate() + daysOffset);
  const windowTo = new Date(windowFrom);
  windowTo.setUTCDate(windowFrom.getUTCDate() + (windowDays - 1));

  const hours = [];
  for (let d = 0; d < windowDays; d += 1) {
    const date = new Date(windowFrom);
    date.setUTCDate(windowFrom.getUTCDate() + d);
    for (const h of hoursPerDay) {
      hours.push({
        date: date.toISOString(),
        hour: h,
        price: priceFor(date, h),
      });
    }
  }

  const totalCost = hours.reduce((sum, h) => sum + h.price, 0);

  return {
    id,
    keyword,
    status,
    video,
    windowFrom: windowFrom.toISOString(),
    windowTo: windowTo.toISOString(),
    hours,
    totalCost,
    createdAt: new Date(today.getTime() - daysOffset * 86400000).toISOString(),
    startedAt: status === 'running' || status === 'completed' ? windowFrom.toISOString() : null,
    endedAt: status === 'completed' ? windowTo.toISOString() : null,
    card: card === undefined ? MOCK_CARD : card,
    performance: performance || null,
    projection: null,
  };
}

const CAMPAIGNS = [
  buildMockCampaign({
    id: 'cam-001',
    keyword: 'design system corporativo',
    status: 'running',
    video: PARTY_AMANDA,
    daysOffset: -3,
    hoursPerDay: [9, 10, 11, 14, 15],
    windowDays: 14,
    performance: {
      impressions: 18420,
      clicks: 1840,
      ctr: 9.98,
      conversions: 87,
      costPerConversion: 24.5,
      spent: 2130,
      remaining: 1370,
    },
  }),
  buildMockCampaign({
    id: 'cam-002',
    keyword: 'recrutamento ágil',
    status: 'scheduled',
    video: PARTY_LUCAS,
    daysOffset: 4,
    hoursPerDay: [10, 11, 12, 13],
    windowDays: 10,
  }),
  buildMockCampaign({
    id: 'cam-003',
    keyword: 'mentoria de carreira',
    status: 'pending',
    video: PARTY_BRUNA,
    daysOffset: 1,
    hoursPerDay: [8, 9, 18, 19],
    windowDays: 7,
    card: null,
  }),
  buildMockCampaign({
    id: 'cam-004',
    keyword: 'cultura organizacional',
    status: 'completed',
    video: PARTY_AMANDA,
    daysOffset: -45,
    hoursPerDay: [12, 13, 14],
    windowDays: 7,
    performance: {
      impressions: 9620,
      clicks: 720,
      ctr: 7.48,
      conversions: 41,
      costPerConversion: 36.8,
      spent: 1510,
      remaining: 0,
    },
  }),
  buildMockCampaign({
    id: 'cam-005',
    keyword: 'workshop de produto',
    status: 'cancelled',
    video: PARTY_LUCAS,
    daysOffset: -10,
    hoursPerDay: [15, 16],
    windowDays: 5,
  }),
];

const ELIGIBLE_VIDEOS = [
  {
    id: 'vid-001',
    title: 'Como nasceu o time de design do Nubank',
    thumbnailUrl: 'https://picsum.photos/seed/met-001/640/360',
    creatorName: 'Amanda Silva',
    channelName: 'Nubank',
    retentionPercent: 62,
    conversionRate: 4.8,
    relevanceScore: 87,
    eligible: true,
    checklist: {
      hasRealCreator: true,
      hasLongVideo: true,
      passedModeration: true,
      hasRealInteraction: true,
      lowRejectionRate: true,
      goodRetention: true,
    },
    blockedReason: null,
  },
  {
    id: 'vid-002',
    title: 'O processo que reduziu nosso churn em 30%',
    thumbnailUrl: 'https://picsum.photos/seed/met-002/640/360',
    creatorName: 'Lucas Pereira',
    channelName: 'Digix',
    retentionPercent: 54,
    conversionRate: 6.1,
    relevanceScore: 79,
    eligible: true,
    checklist: {
      hasRealCreator: true,
      hasLongVideo: true,
      passedModeration: true,
      hasRealInteraction: true,
      lowRejectionRate: true,
      goodRetention: true,
    },
    blockedReason: null,
  },
  {
    id: 'vid-003',
    title: 'Bastidores: nossa primeira contratação remota',
    thumbnailUrl: 'https://picsum.photos/seed/met-003/640/360',
    creatorName: 'Amanda Silva',
    channelName: 'Itaú',
    retentionPercent: 71,
    conversionRate: 3.2,
    relevanceScore: 82,
    eligible: true,
    checklist: {
      hasRealCreator: true,
      hasLongVideo: true,
      passedModeration: true,
      hasRealInteraction: true,
      lowRejectionRate: true,
      goodRetention: true,
    },
    blockedReason: null,
  },
  {
    id: 'vid-004',
    title: 'Por que paramos de usar OKRs trimestrais',
    thumbnailUrl: 'https://picsum.photos/seed/met-004/640/360',
    creatorName: 'Lucas Pereira',
    channelName: 'Digix',
    retentionPercent: 38,
    conversionRate: 1.4,
    relevanceScore: 51,
    eligible: false,
    checklist: {
      hasRealCreator: true,
      hasLongVideo: true,
      passedModeration: true,
      hasRealInteraction: false,
      lowRejectionRate: false,
      goodRetention: false,
    },
    blockedReason:
      'Retenção média abaixo de 45% e taxa de rejeição alta. Republique com novo gancho antes de impulsionar.',
  },
];

function listCampaigns({ status, page = 1, pageSize = 20 }) {
  let filtered = CAMPAIGNS.slice();
  if (status) filtered = filtered.filter((c) => c.status === status);
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
}

function getCampaign(id) {
  return CAMPAIGNS.find((c) => c.id === id) || null;
}

function projectionFor({ keyword, videoId, hours }) {
  const video = ELIGIBLE_VIDEOS.find((v) => v.id === videoId);
  if (!video || !video.eligible) {
    return { estimatedImpressions: 0, estimatedClicks: 0, estimatedConversions: 0, relevanceScore: 0, winProbability: 0 };
  }
  const hourCount = Math.max(1, hours.length);
  const estimatedImpressions = Math.round(hourCount * 320 * (video.retentionPercent / 60));
  const estimatedClicks = Math.round(estimatedImpressions * 0.08);
  const estimatedConversions = Math.round(estimatedClicks * (video.conversionRate / 100));
  const keywordCompetition = (keyword || '').length > 20 ? 0.55 : 0.78;
  const winProbability = Math.min(0.95, (video.relevanceScore / 100) * keywordCompetition);
  return {
    estimatedImpressions,
    estimatedClicks,
    estimatedConversions,
    relevanceScore: video.relevanceScore,
    winProbability: Math.round(winProbability * 100) / 100,
  };
}

function createCampaign({ keyword, videoId, hours }) {
  const video = ELIGIBLE_VIDEOS.find((v) => v.id === videoId);
  if (!video) return { ok: false, code: 'video-not-found' };
  if (!video.eligible) return { ok: false, code: 'video-ineligible' };
  if (!Array.isArray(hours) || hours.length === 0) return { ok: false, code: 'no-hours' };

  const hoursWithPrice = hours.map((h) => ({
    date: new Date(h.date).toISOString(),
    hour: h.hour,
    price: priceFor(new Date(h.date), h.hour),
  }));

  const dates = hoursWithPrice.map((h) => new Date(h.date).getTime());
  const windowFrom = new Date(Math.min(...dates));
  const windowTo = new Date(Math.max(...dates));

  const card = MOCK_CARD; // assume default for mock
  const status = card ? 'scheduled' : 'pending';

  const campaign = {
    id: `cam-${String(CAMPAIGNS.length + 1).padStart(3, '0')}`,
    keyword,
    status,
    video: {
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      creatorName: video.creatorName,
      channelName: video.channelName,
    },
    windowFrom: windowFrom.toISOString(),
    windowTo: windowTo.toISOString(),
    hours: hoursWithPrice,
    totalCost: hoursWithPrice.reduce((sum, h) => sum + h.price, 0),
    createdAt: new Date().toISOString(),
    startedAt: null,
    endedAt: null,
    card,
    performance: null,
    projection: projectionFor({ keyword, videoId, hours }),
  };

  CAMPAIGNS.unshift(campaign);
  return { ok: true, campaign };
}

function cancelCampaign(id) {
  const campaign = CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) return { ok: false, code: 'not-found' };
  if (campaign.status === 'completed' || campaign.status === 'cancelled') {
    return { ok: false, code: 'not-cancellable' };
  }
  campaign.status = 'cancelled';
  return { ok: true, campaign };
}

module.exports = {
  listCampaigns,
  getCampaign,
  buildCalendar,
  projectionFor,
  createCampaign,
  cancelCampaign,
  ELIGIBLE_VIDEOS,
};
