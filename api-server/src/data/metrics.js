function buildRetentionCurve(duration, hook, climaxAt, climaxRetention, dropAt) {
  const steps = 12;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const second = Math.round((duration / steps) * i);
    let retention;
    if (second <= 3) {
      retention = hook;
    } else if (second < climaxAt) {
      const progress = (second - 3) / Math.max(1, climaxAt - 3);
      retention = hook + (climaxRetention - hook) * progress;
    } else if (second < dropAt) {
      const progress = (second - climaxAt) / Math.max(1, dropAt - climaxAt);
      retention = climaxRetention - (climaxRetention - climaxRetention * 0.55) * progress;
    } else {
      const progress = (second - dropAt) / Math.max(1, duration - dropAt);
      retention = climaxRetention * 0.55 - climaxRetention * 0.35 * progress;
    }
    points.push({ second, retention: Math.max(8, Math.min(100, Math.round(retention))) });
  }
  return points;
}

const VIDEO_TEMPLATES = [
  {
    id: 'vid-001',
    title: 'Como nasceu o time de design do Nubank',
    thumbnailUrl: 'https://picsum.photos/seed/met-001/640/360',
    publishedAt: '2026-05-08T14:00:00Z',
    durationSeconds: 540,
    views: 18420,
    avgRetentionPercent: 62,
    hookRetentionPercent: 88,
    climaxAtSecond: 210,
    climaxRetentionPercent: 76,
    dropOffAtSecond: 340,
    subscribersGained: 412,
    conversions: 89,
  },
  {
    id: 'vid-002',
    title: 'O processo que reduziu nosso churn em 30%',
    thumbnailUrl: 'https://picsum.photos/seed/met-002/640/360',
    publishedAt: '2026-05-02T09:30:00Z',
    durationSeconds: 720,
    views: 12340,
    avgRetentionPercent: 54,
    hookRetentionPercent: 81,
    climaxAtSecond: 305,
    climaxRetentionPercent: 70,
    dropOffAtSecond: 430,
    subscribersGained: 268,
    conversions: 142,
  },
  {
    id: 'vid-003',
    title: 'Bastidores: nossa primeira contratação remota',
    thumbnailUrl: 'https://picsum.photos/seed/met-003/640/360',
    publishedAt: '2026-04-25T18:15:00Z',
    durationSeconds: 380,
    views: 9210,
    avgRetentionPercent: 71,
    hookRetentionPercent: 92,
    climaxAtSecond: 130,
    climaxRetentionPercent: 82,
    dropOffAtSecond: 250,
    subscribersGained: 184,
    conversions: 47,
  },
  {
    id: 'vid-004',
    title: 'Por que paramos de usar OKRs trimestrais',
    thumbnailUrl: 'https://picsum.photos/seed/met-004/640/360',
    publishedAt: '2026-04-18T11:00:00Z',
    durationSeconds: 612,
    views: 7480,
    avgRetentionPercent: 48,
    hookRetentionPercent: 74,
    climaxAtSecond: 280,
    climaxRetentionPercent: 64,
    dropOffAtSecond: 380,
    subscribersGained: 95,
    conversions: 33,
  },
];

const VIDEOS = VIDEO_TEMPLATES.map((video) => ({
  ...video,
  watchTimeSeconds: Math.round(video.views * (video.durationSeconds * (video.avgRetentionPercent / 100))),
  retentionCurve: buildRetentionCurve(
    video.durationSeconds,
    video.hookRetentionPercent,
    video.climaxAtSecond,
    video.climaxRetentionPercent,
    video.dropOffAtSecond,
  ),
}));

function buildGrowthSeries(days) {
  const series = [];
  const today = new Date('2026-05-17T00:00:00Z');
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today.getTime() - i * 86400000);
    const wave = Math.sin(i / 2) * 0.4 + 0.7;
    const subscribers = Math.max(2, Math.round(40 * wave + (days - i) * 1.3));
    const views = Math.max(50, Math.round(900 * wave + (days - i) * 18));
    series.push({ date: date.toISOString(), subscribers, views });
  }
  return series;
}

const PERIOD_CONFIG = {
  '7d': { days: 7, multiplier: 0.25 },
  '30d': { days: 30, multiplier: 1 },
  '90d': { days: 30, multiplier: 2.6 },
  all: { days: 30, multiplier: 6.4 },
};

function scaleVideos(multiplier) {
  return VIDEOS.map((video) => ({
    ...video,
    views: Math.round(video.views * multiplier),
    watchTimeSeconds: Math.round(video.watchTimeSeconds * multiplier),
    subscribersGained: Math.round(video.subscribersGained * multiplier),
    conversions: Math.round(video.conversions * multiplier),
  }));
}

function aggregateKpis(topVideos, growth) {
  const totalViews = topVideos.reduce((sum, v) => sum + v.views, 0);
  const totalWatchTime = topVideos.reduce((sum, v) => sum + v.watchTimeSeconds, 0);
  const avgWatchTimeSeconds = topVideos.length === 0 ? 0 : Math.round(totalWatchTime / totalViews);
  const avgRetentionPercent =
    topVideos.length === 0
      ? 0
      : Math.round(topVideos.reduce((sum, v) => sum + v.avgRetentionPercent, 0) / topVideos.length);
  const totalConversions = topVideos.reduce((sum, v) => sum + v.conversions, 0);
  const totalSubscribers = growth.reduce((sum, p) => sum + p.subscribers, 0);
  return {
    totalViews,
    avgWatchTimeSeconds,
    avgRetentionPercent,
    totalConversions,
    totalSubscribers,
    viewsChangePercent: 12,
    watchTimeChangePercent: 4,
    retentionChangePercent: -3,
    subscribersChangePercent: 18,
  };
}

function buildInsights(topVideos) {
  if (topVideos.length === 0) return [];
  const best = [...topVideos].sort((a, b) => b.avgRetentionPercent - a.avgRetentionPercent)[0];
  const worst = [...topVideos].sort((a, b) => a.avgRetentionPercent - b.avgRetentionPercent)[0];
  const topConv = [...topVideos].sort((a, b) => b.conversions - a.conversions)[0];

  return [
    {
      id: 'best-retention',
      tone: 'positive',
      title: `Seu gancho mais forte: "${best.title}"`,
      message: `Reteve ${best.hookRetentionPercent}% nos 3 primeiros segundos e ${best.avgRetentionPercent}% em média. Replique a estrutura de abertura.`,
    },
    {
      id: 'climax-tip',
      tone: 'neutral',
      title: `O clímax acontece por volta de ${Math.round(best.climaxAtSecond / 60)}min`,
      message:
        'Use esse trecho como teaser nos vídeos curtos. Funciona como trailer para o vídeo longo (descoberta → profundidade).',
    },
    {
      id: 'drop-warning',
      tone: 'warning',
      title: `"${worst.title}" está caindo cedo`,
      message: `Queda forte aos ${Math.round(worst.dropOffAtSecond / 60)}min. Considere encurtar a introdução ou reorganizar a narrativa.`,
    },
    {
      id: 'conversion-leader',
      tone: 'positive',
      title: `"${topConv.title}" lidera em "Saiba mais"`,
      message: `${topConv.conversions} conversões. Boa candidata para campanha patrocinada qualificada (passa nos critérios de retenção e moderação).`,
    },
  ];
}

function buildOverview(periodKey) {
  const config = PERIOD_CONFIG[periodKey] || PERIOD_CONFIG['30d'];
  const topVideos = scaleVideos(config.multiplier);
  const growth = buildGrowthSeries(config.days);
  const kpis = aggregateKpis(topVideos, growth);
  const insights = buildInsights(topVideos);

  return {
    period: periodKey,
    generatedAt: new Date().toISOString(),
    kpis,
    topVideos,
    growth,
    insights,
  };
}

module.exports = { buildOverview };
