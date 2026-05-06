const DIGIX_CHANNEL = {
  id: '124e9f9f-6310-447f-9ba3-29e90219ff99',
  profileName: 'Digix',
  profileNameOfficial: 'Digix',
  profilePicture:
    'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245540/digix_logo_sguqv0.jpg',
  coverPicture:
    'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245557/somosdigix_cover_innpe4.jpg',
  numberOfFollowers: 15200,
  numberOfPublication: 324,
  numberOfToFollow: 45,
  verified: true,
  email: 'contato@digix.com',
  isReported: false,
  isBlocked: false,
  overview: 'Soluções tecnológicas para o setor público.',
  visitWebsite: 'digix.com',
};

const EMPTY_COMMENT = { data: [], page: 1, pageSize: 0, pages: 0, totalRecords: 0 };

// Winning-slots: itens injetados em buracos da grid (ads, informativos, recos).
// `media.contentType` define o renderer:
//   - 'movie'      → vídeo (mp4 / hls)
//   - 'image'      → imagem estática (com link/cta opcional)
//   - 'html'       → markup arbitrário (sanitizado no front)
//   - 'component'  → referência a um componente Angular registrado (componentId)
// `media.aspectRatio` define qual gap o slot consegue preencher
// ('9:16' → 1 col na grid; '16:9' → 3 cols na grid de 6 / 2 cols no mobile).
// `slotKind` é uma classificação semântica usada por reporting/targeting.
const MOCK_WINNING_SLOTS = [
  // ── movie · 16:9 ─────────────────────────────────────────────────────────
  {
    id: 'ws-mv-169-001',
    postType: 'winning-slot',
    slotKind: 'recommendation',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 1247,
    comments: 28,
    shares: 156,
    views: 12589,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'movie',
      aspectRatio: '16:9',
      resolution: '1920x1080',
      guidance: 'landscape',
      long: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1775245259/scene_1_jxxydk.mp4',
      short: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1775245259/scene_1_jxxydk.mp4',
      thumbnail:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245377/Captura_de_tela_2026-04-03_164241_wraelh.png',
      description:
        'Hack Hunters é um treinamento imersivo para transformar profissionais de TI em verdadeiros caçadores no ciberespaço.',
      slang: ['Hack Hunters', 'Cybersecurity', 'Educação'],
      id: 'ws-mv-169-001-media',
      title: 'Hack Hunters - Cyber investigations',
      titleLink: 'hack-hunters-cyber-investigations',
      photoPreviewIcon: '',
      isPlaying: false,
      isMuted: false,
      volume: 0.5,
      progress: 0,
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── movie · 9:16 ─────────────────────────────────────────────────────────
  {
    id: 'ws-mv-916-001',
    postType: 'winning-slot',
    slotKind: 'recommendation',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 2876,
    comments: 89,
    shares: 421,
    views: 23456,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'movie',
      aspectRatio: '9:16',
      resolution: '1080x1920',
      guidance: 'portrait',
      long: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1778026782/6210541-hd_1080_1920_25fps_shgrd5.mp4',
      short: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1778026782/6210541-hd_1080_1920_25fps_shgrd5.mp4',
      thumbnail:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1778027195/thumbnail_3s_vk9o3e.png',
      description:
        'Celebrando o Dia Internacional da Mulher com reflexões sobre equidade e representatividade.',
      slang: ['Dia da mulher', 'Equidade', 'Digix'],
      id: 'ws-mv-916-001-media',
      title: 'Dia da Mulher: reflexão e celebração',
      titleLink: 'dia-da-mulher-reflexao-e-celebracao',
      photoPreviewIcon: '',
      isPlaying: false,
      isMuted: false,
      volume: 0.5,
      progress: 0,
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── image · 16:9 ─────────────────────────────────────────────────────────
  {
    id: 'ws-img-169-001',
    postType: 'winning-slot',
    slotKind: 'ad',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 1500,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'image',
      aspectRatio: '16:9',
      resolution: '1920x1080',
      guidance: 'landscape',
      image:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245377/Captura_de_tela_2026-04-03_164241_wraelh.png',
      thumbnail:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245377/Captura_de_tela_2026-04-03_164241_wraelh.png',
      description: 'Conheça nossas soluções para gestão pública.',
      slang: ['Digix', 'Gestão pública'],
      id: 'ws-img-169-001-media',
      title: 'Soluções Digix',
      titleLink: 'solucoes-digix',
      link: 'https://digix.com',
      cta: 'Saiba mais',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── image · 9:16 ─────────────────────────────────────────────────────────
  {
    id: 'ws-img-916-001',
    postType: 'winning-slot',
    slotKind: 'ad',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 980,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'image',
      aspectRatio: '9:16',
      resolution: '1080x1920',
      guidance: 'portrait',
      image:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1778026290/10523130_bbgt5f.jpg',
      thumbnail:
        'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1778026290/10523130_bbgt5f.jpg',
      description: 'Faça parte do time Digix.',
      slang: ['Vagas', 'Trabalhe na Digix'],
      id: 'ws-img-916-001-media',
      title: 'Vagas abertas',
      titleLink: 'vagas-abertas',
      link: 'https://digix.com/vagas',
      cta: 'Aplicar',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── html · 16:9 ──────────────────────────────────────────────────────────
  // Slot renderizado via HTML inline (sanitizado no front com SafeHtmlPipe).
  {
    id: 'ws-html-169-001',
    postType: 'winning-slot',
    slotKind: 'informative',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 540,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'html',
      aspectRatio: '16:9',
      resolution: null,
      guidance: 'landscape',
      html: '<div class="ws-banner"><h3>Newsletter Digix</h3><p>Receba conteúdo semanal sobre tecnologia no setor público.</p><button class="ws-cta">Inscrever</button></div>',
      css: '.ws-banner{background:linear-gradient(135deg,#5a0a3d,#8a1f5e);color:#fff;padding:24px;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:8px}.ws-banner h3{font-size:1.4rem;margin:0}.ws-banner p{font-size:.9rem;opacity:.85;margin:0}.ws-cta{background:#fff;color:#5a0a3d;border:none;padding:8px 18px;border-radius:8px;cursor:pointer;font-weight:600}',
      description: 'Newsletter Digix',
      id: 'ws-html-169-001-media',
      title: 'Newsletter Digix',
      titleLink: 'newsletter-digix',
      link: 'https://digix.com/newsletter',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── html · 9:16 ──────────────────────────────────────────────────────────
  {
    id: 'ws-html-916-001',
    postType: 'winning-slot',
    slotKind: 'informative',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 412,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'html',
      aspectRatio: '9:16',
      resolution: null,
      guidance: 'portrait',
      html: '<div class="ws-premium"><span class="ws-premium__badge">50% de desconto</span><h3>Assine o Premium</h3><p>Elimine os anúncios, veja suas análises, aumente suas respostas e desbloqueie mais de 20 recursos.</p><button class="ws-premium__cta" type="button">Subscribe &amp; Pay</button></div>',
      css: '.ws-premium{background:#000;color:#fff;padding:20px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;gap:8px}.ws-premium__badge{display:inline-block;align-self:flex-start;background:#fff;color:#000;font-weight:700;font-size:.7rem;padding:2px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em}.ws-premium h3{font-size:2rem;margin:0;color:#fff}.ws-premium p{font-size:1.5rem;opacity:.8;margin:0;color:#fff}.ws-premium__cta{align-self:flex-start;background:#fff;color:#000;border:none;border-radius:15px;padding:10px 18px;font-size:.9rem;font-weight:700;cursor:pointer;margin-top:8px}.ws-premium__cta:hover{background:#f0f0f0}',
      description: 'Assine o Premium',
      id: 'ws-html-916-001-media',
      title: 'Assine o Premium',
      titleLink: 'assine-o-premium',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── component · 9:16 ─────────────────────────────────────────────────────
  // Slot que referencia um componente Angular registrado no frontend pelo
  // `componentId`. Permite slots interativos (formulários, enquetes etc).
  {
    id: 'ws-cmp-916-001',
    postType: 'winning-slot',
    slotKind: 'interactive',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 320,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'component',
      aspectRatio: '9:16',
      resolution: null,
      guidance: 'portrait',
      componentId: 'newsletter-signup',
      props: {
        title: 'Explore conexões, marcas e oportunidades feitas pra você.',
        placeholder: 'seu@email.com',
        submitLabel: 'Criar uma conta',
      },
      description: 'Inscrição rápida na newsletter.',
      id: 'ws-cmp-916-001-media',
      title: 'Newsletter signup',
      titleLink: 'newsletter-signup',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },

  // ── component · 16:9 ─────────────────────────────────────────────────────
  {
    id: 'ws-cmp-169-001',
    postType: 'winning-slot',
    slotKind: 'interactive',
    timestamp: '2025-03-07 21:29:25.187',
    isLiked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 260,
    isReported: false,
    isBlocked: false,
    media: {
      contentType: 'component',
      aspectRatio: '16:9',
      resolution: null,
      guidance: 'landscape',
      componentId: 'poll-quick',
      props: {
        question: 'Qual conteúdo você prefere ver na home?',
        options: ['Shorts', 'Long-form', 'Tutoriais', 'Cases'],
      },
      description: 'Enquete rápida embutida no feed.',
      id: 'ws-cmp-169-001-media',
      title: 'Enquete rápida',
      titleLink: 'enquete-rapida',
    },
    channel: DIGIX_CHANNEL,
    comment: EMPTY_COMMENT,
  },
];

module.exports = { MOCK_WINNING_SLOTS };
