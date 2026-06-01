// In-memory store for Minha Empresa (organizations, products, submissions, members).
// Keeps everything in one module so the routes can mutate state without persistence.

const NOW = () => new Date().toISOString();

const PRODUCT_TYPES = ['job', 'service', 'training', 'news', 'experience'];
const PRODUCT_PHASES = ['backlog', 'in_campaign', 'paused', 'closed'];

const SUBMISSION_PHASES_BY_TYPE = {
  job: ['job_received', 'job_adequate', 'job_interview', 'job_documents', 'job_approved', 'job_rejected'],
  service: ['service_received', 'service_qualified', 'service_meeting', 'service_proposal', 'service_closed', 'service_lost'],
  training: ['training_enrolled', 'training_confirmed', 'training_present', 'training_completed', 'training_certified'],
  news: ['news_received', 'news_segmented', 'news_engaged', 'news_subscriber'],
  experience: ['experience_requested', 'experience_scheduled', 'experience_confirmed', 'experience_fulfilled'],
};

const INITIAL_PHASE_BY_TYPE = {
  job: 'job_received',
  service: 'service_received',
  training: 'training_enrolled',
  news: 'news_received',
  experience: 'experience_requested',
};

// ---------- Organizations ----------

const organizations = [
  {
    id: 'org-001',
    slug: 'nubank',
    name: 'Nubank',
    corporateEmail: 'admin@nubank.com.br',
    website: 'https://nubank.com.br',
    socialLinks: [
      'https://www.instagram.com/nubank',
      'https://www.linkedin.com/company/nubank',
    ],
    bannerUrl: 'https://picsum.photos/seed/nubank-banner/1600/400',
    logoUrl: 'https://picsum.photos/seed/nubank-logo/200/200',
    about:
      'Somos uma das maiores instituições financeiras digitais do mundo, construindo uma nova relação das pessoas com seu dinheiro.',
    publicPageEnabled: true,
    isFavorite: true,
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-03-14T08:30:00.000Z',
  },
  {
    id: 'org-002',
    slug: 'magazine-luiza',
    name: 'Magazine Luiza',
    corporateEmail: 'admin@magazineluiza.com.br',
    website: 'https://www.magazineluiza.com.br',
    socialLinks: ['https://www.instagram.com/magazineluiza'],
    bannerUrl: 'https://picsum.photos/seed/magalu-banner/1600/400',
    logoUrl: 'https://picsum.photos/seed/magalu-logo/200/200',
    about: 'Plataforma de tecnologia e comércio que conecta marcas e consumidores.',
    publicPageEnabled: false,
    isFavorite: false,
    createdAt: '2025-02-04T10:00:00.000Z',
    updatedAt: '2025-02-04T10:00:00.000Z',
  },
];

// ---------- Departments ----------

const departments = [
  // Nubank
  {
    id: 'dept-001',
    organizationId: 'org-001',
    slug: 'engenharia',
    name: 'Engenharia',
    description: 'Plataforma, apps e infraestrutura. Vagas técnicas e treinamentos de engenharia.',
    icon: 'code',
    color: '#2563eb',
    isFavorite: true,
    membersCount: 24,
    createdAt: '2025-01-12T12:00:00.000Z',
    updatedAt: '2025-03-14T08:30:00.000Z',
  },
  {
    id: 'dept-002',
    organizationId: 'org-001',
    slug: 'marketing',
    name: 'Marketing',
    description: 'Comunicação, campanhas e conteúdo institucional.',
    icon: 'campaign',
    color: '#f59e0b',
    isFavorite: false,
    membersCount: 12,
    createdAt: '2025-01-15T12:00:00.000Z',
    updatedAt: '2025-02-20T08:30:00.000Z',
  },
  {
    id: 'dept-003',
    organizationId: 'org-001',
    slug: 'produto',
    name: 'Produto',
    description: 'Produtos financeiros, serviços e ofertas para clientes PF e PJ.',
    icon: 'inventory_2',
    color: '#a855f7',
    isFavorite: false,
    membersCount: 9,
    createdAt: '2025-01-18T12:00:00.000Z',
    updatedAt: '2025-02-22T08:30:00.000Z',
  },
  {
    id: 'dept-004',
    organizationId: 'org-001',
    slug: 'pessoas',
    name: 'Pessoas & Cultura',
    description: 'Recrutamento, cultura e experiências para colaboradores e candidatos.',
    icon: 'groups',
    color: '#10b981',
    isFavorite: false,
    membersCount: 7,
    createdAt: '2025-01-20T12:00:00.000Z',
    updatedAt: '2025-02-25T08:30:00.000Z',
  },
  // Magazine Luiza
  {
    id: 'dept-005',
    organizationId: 'org-002',
    slug: 'tecnologia',
    name: 'Tecnologia',
    description: 'Plataforma de e-commerce, logtech e fintech do grupo.',
    icon: 'code',
    color: '#0ea5e9',
    isFavorite: false,
    membersCount: 15,
    createdAt: '2025-02-05T12:00:00.000Z',
    updatedAt: '2025-02-05T12:00:00.000Z',
  },
  {
    id: 'dept-006',
    organizationId: 'org-002',
    slug: 'vendas',
    name: 'Vendas',
    description: 'Operação comercial, lojas físicas e marketplace.',
    icon: 'shopping_cart',
    color: '#dc2626',
    isFavorite: false,
    membersCount: 30,
    createdAt: '2025-02-06T12:00:00.000Z',
    updatedAt: '2025-02-06T12:00:00.000Z',
  },
];

// ---------- Products ----------

function makeLearnMoreConfig(type) {
  const common = {
    submitButtonLabel: ctaLabelByType(type),
    showCheckboxPrivacyPolicy: true,
    showRevisionStep: true,
  };

  const fieldsByType = {
    job: [
      stepOf('contato', 'Seus dados', [
        textField('name', 'Nome completo', true),
        emailField('email', 'E-mail', true),
        textField('phone', 'Telefone', false),
      ]),
      stepOf('profissional', 'Trajetória', [
        textField('linkedin', 'LinkedIn', false),
        uploadField('resume', 'Currículo', true),
      ]),
    ],
    service: [
      stepOf('contato', 'Sobre você', [
        textField('name', 'Nome', true),
        emailField('email', 'E-mail', true),
        textField('company', 'Empresa', true),
        selectField('size', 'Porte da empresa', ['1-10', '11-50', '51-200', '200+'], true),
      ]),
      stepOf('necessidade', 'Sua necessidade', [
        textField('budget', 'Orçamento estimado', false),
        textField('timeline', 'Prazo desejado', false),
      ]),
    ],
    training: [
      stepOf('inscricao', 'Inscrição', [
        textField('name', 'Nome', true),
        emailField('email', 'E-mail', true),
        selectField('level', 'Nível', ['Iniciante', 'Intermediário', 'Avançado'], true),
        textField('motivation', 'Por que quer participar?', false),
      ]),
    ],
    news: [
      stepOf('optin', 'Receba novidades', [
        emailField('email', 'E-mail', true),
        selectField('frequency', 'Frequência', ['Diária', 'Semanal', 'Mensal'], false),
      ]),
    ],
    experience: [
      stepOf('agendamento', 'Agendamento', [
        textField('name', 'Nome', true),
        emailField('email', 'E-mail', true),
        textField('preferredDate', 'Data preferencial', true),
        textField('people', 'Número de pessoas', false),
      ]),
    ],
  };

  return { ...common, steps: fieldsByType[type] || [] };
}

function ctaLabelByType(type) {
  return {
    job: 'Candidatar-se',
    service: 'Falar com vendas',
    training: 'Inscrever-se',
    news: 'Receber novidades',
    experience: 'Reservar',
  }[type] || 'Saiba mais';
}

function stepOf(id, title, fields) {
  return { id, title, fields };
}

function textField(id, label, required) {
  return { id, type: 'text', label, placeholder: '', required };
}
function emailField(id, label, required) {
  return { id, type: 'email', label, placeholder: '', required };
}
function uploadField(id, label, required) {
  return { id, type: 'uploadFile', label, required };
}
function selectField(id, label, values, required) {
  return {
    id,
    type: 'select',
    label,
    required,
    options: values.map((v) => ({ value: v.toLowerCase(), label: v })),
  };
}

const products = [
  // Nubank — 1 of each type
  buildProduct({
    id: 'prod-001',
    organizationId: 'org-001',
    departmentId: 'dept-001',
    type: 'job',
    phase: 'in_campaign',
    title: 'Engenheiro(a) Angular Sênior',
    subtitle: 'Time de Plataforma',
    badges: ['Remoto', 'Pleno/Sênior', 'CLT'],
    location: 'São Paulo, SP · Remoto',
    descriptionBlocks: [
      ['Atividades', 'Construir features no app principal, mentoria de pleno e revisão de PRs.'],
      ['Requisitos', '5+ anos com Angular, signals, RxJS, testes automatizados.'],
      ['Benefícios', 'PLR, plano de saúde, equipamento, day-off no aniversário.'],
    ],
    screeningQuestions: [
      { id: 'q1', question: 'Quantos anos de experiência com Angular?', idealAnswer: '5', required: true },
    ],
    eligibility: { mode: 'groups', groupIds: ['cgrp-001'] },
  }),
  buildProduct({
    id: 'prod-002',
    organizationId: 'org-001',
    departmentId: 'dept-003',
    type: 'service',
    phase: 'in_campaign',
    title: 'Conta PJ para MEI e PME',
    subtitle: 'Sem mensalidade, abertura digital',
    badges: ['PJ', 'Digital'],
    location: 'Brasil',
    descriptionBlocks: [
      ['Descrição', 'Conta corrente e cartão sem mensalidade, com gestão financeira integrada.'],
      ['Casos de uso', 'MEI, ME, EPP, prestadores de serviço.'],
    ],
  }),
  buildProduct({
    id: 'prod-003',
    organizationId: 'org-001',
    departmentId: 'dept-001',
    type: 'training',
    phase: 'in_campaign',
    title: 'Workshop: Como o Nubank usa Angular Signals',
    subtitle: 'Online, ao vivo · 2h',
    badges: ['Online', '2h', 'Intermediário'],
    location: 'Online',
    descriptionBlocks: [
      ['Ementa', 'Fundamentos de signals, padrão store+facade, migração de RxJS.'],
      ['Pré-requisitos', 'Experiência prévia com Angular.'],
    ],
    eligibility: { mode: 'creators', creatorIds: ['creator-001', 'creator-002'] },
  }),
  buildProduct({
    id: 'prod-004',
    organizationId: 'org-001',
    departmentId: 'dept-002',
    type: 'news',
    phase: 'paused',
    title: 'Release Notes Q1/2026 — App Nubank',
    subtitle: 'O que mudou no app este trimestre',
    badges: ['Trimestral'],
    location: '',
    descriptionBlocks: [
      ['Lide', 'Novidades em transferências internacionais, investimentos e cartões.'],
      ['Corpo', 'Detalhes técnicos das principais features lançadas no Q1/2026.'],
    ],
  }),
  buildProduct({
    id: 'prod-005',
    organizationId: 'org-001',
    departmentId: 'dept-004',
    type: 'experience',
    phase: 'backlog',
    title: 'Tour pela sede em SP',
    subtitle: 'Visita guiada · 1h',
    badges: ['Presencial', '1h'],
    location: 'Av. Brigadeiro Faria Lima, São Paulo',
    descriptionBlocks: [
      ['Roteiro', 'Apresentação institucional, visita aos andares de produto e bate-papo com lideranças.'],
      ['O que está incluído', 'Café da manhã e brindes Nubank.'],
    ],
  }),
];

function normalizeEligibility(raw) {
  const mode = ['any', 'creators', 'groups'].includes(raw?.mode) ? raw.mode : 'any';
  return {
    mode,
    creatorIds: mode === 'creators' && Array.isArray(raw?.creatorIds) ? raw.creatorIds : [],
    groupIds: mode === 'groups' && Array.isArray(raw?.groupIds) ? raw.groupIds : [],
  };
}

function buildProduct({
  id,
  organizationId,
  departmentId = null,
  type,
  phase,
  title,
  subtitle = '',
  badges = [],
  location = '',
  descriptionBlocks = [],
  screeningQuestions = [],
  eligibility,
}) {
  return {
    id,
    organizationId,
    departmentId,
    type,
    phase,
    title,
    subtitle,
    badges,
    location,
    description: descriptionBlocks.map(([t, body], i) => ({
      id: `block-${i + 1}`,
      title: t,
      body,
    })),
    screeningQuestions,
    learnMoreConfig: makeLearnMoreConfig(type),
    eligibility: normalizeEligibility(eligibility),
    metrics: { views: 50 + Math.floor(Math.random() * 500), submissions: 0 },
    publishedAt: phase === 'in_campaign' ? '2025-03-10T12:00:00.000Z' : null,
    createdAt: '2025-03-01T12:00:00.000Z',
    updatedAt: '2025-03-10T12:00:00.000Z',
  };
}

// ---------- Submissions ----------

const submissions = [
  buildSubmission({
    id: 'sub-001',
    productId: 'prod-001',
    candidateName: 'Saulo McChelsom',
    contextLine: 'Senior Angular Developer · Vitória, ES',
    source: {
      creatorId: 'creator-001',
      creatorName: 'Amanda Silva',
      creatorHandle: 'amanda.silva',
      pitchId: 'pitch-001',
      pitchTitle: 'Como é trabalhar com Angular no Nubank',
    },
    answers: [
      ['name', 'Nome completo', 'Saulo McChelsom'],
      ['email', 'E-mail', 'saulo@example.com'],
      ['linkedin', 'LinkedIn', 'https://linkedin.com/in/saulomcchelsom'],
    ],
    screeningAnswers: [
      ['q1', 'Quantos anos de experiência com Angular?', '5', '7', true, true],
    ],
  }),
  buildSubmission({
    id: 'sub-002',
    productId: 'prod-001',
    candidateName: 'Ana Costa',
    contextLine: 'Tech Lead Frontend · São Paulo, SP',
    phase: 'job_adequate',
    source: {
      creatorId: 'creator-002',
      creatorName: 'Bruno Costa',
      creatorHandle: 'bruno.costa',
      pitchId: 'pitch-002',
      pitchTitle: 'Entrevista com a Engenheira Chefe da Plataforma',
    },
    answers: [
      ['name', 'Nome completo', 'Ana Costa'],
      ['email', 'E-mail', 'ana@example.com'],
    ],
    screeningAnswers: [
      ['q1', 'Quantos anos de experiência com Angular?', '5', '9', true, true],
    ],
  }),
  buildSubmission({
    id: 'sub-003',
    productId: 'prod-002',
    candidateName: 'Padaria do João',
    contextLine: 'MEI · São Paulo, SP',
    answers: [
      ['name', 'Nome', 'João Silva'],
      ['email', 'E-mail', 'joao@padariadojoao.com'],
      ['company', 'Empresa', 'Padaria do João'],
      ['size', 'Porte da empresa', '1-10'],
    ],
  }),
  buildSubmission({
    id: 'sub-004',
    productId: 'prod-003',
    candidateName: 'Maria Souza',
    contextLine: 'Desenvolvedora Pleno · Belo Horizonte',
    phase: 'training_confirmed',
    source: {
      creatorId: 'creator-001',
      creatorName: 'Amanda Silva',
      creatorHandle: 'amanda.silva',
      pitchId: 'pitch-003',
      pitchTitle: 'Workshop de Signals — bastidores',
    },
    answers: [
      ['name', 'Nome', 'Maria Souza'],
      ['email', 'E-mail', 'maria@example.com'],
      ['level', 'Nível', 'intermediário'],
    ],
  }),
];

function buildSubmission({
  id,
  productId,
  candidateName,
  contextLine,
  phase,
  source = null,
  answers = [],
  screeningAnswers = [],
}) {
  const product = products.find((p) => p.id === productId);
  const resolvedPhase = phase || INITIAL_PHASE_BY_TYPE[product.type];
  return {
    id,
    organizationId: product.organizationId,
    productId,
    productType: product.type,
    productTitle: product.title,
    phase: resolvedPhase,
    candidate: {
      name: candidateName,
      email: (answers.find(([k]) => k === 'email') || [])[2] || '',
      avatarUrl: `https://i.pravatar.cc/120?u=${encodeURIComponent(id)}`,
      contextLine,
    },
    source,
    answers: answers.map(([fieldId, label, value]) => ({ fieldId, label, value })),
    screeningAnswers: screeningAnswers.map(
      ([questionId, question, idealAnswer, answer, required, matchesIdeal]) => ({
        questionId,
        question,
        idealAnswer,
        answer,
        required,
        matchesIdeal,
      }),
    ),
    internalNotes: '',
    assignedTo: null,
    history: [
      {
        id: `h-${id}-1`,
        actor: 'Sistema',
        action: 'Submissão recebida via Saiba Mais',
        fromPhase: null,
        toPhase: resolvedPhase,
        note: '',
        createdAt: '2025-03-14T10:30:00.000Z',
      },
    ],
    createdAt: '2025-03-14T10:30:00.000Z',
    updatedAt: '2025-03-14T10:30:00.000Z',
  };
}

// Update submission counts on products
function refreshProductMetrics() {
  for (const product of products) {
    product.metrics.submissions = submissions.filter((s) => s.productId === product.id).length;
  }
}
refreshProductMetrics();

// ---------- Roles, Members, Groups ----------

const DEFAULT_PERMISSIONS = [
  'createProduct',
  'editProduct',
  'moveProductPhase',
  'closeProduct',
  'deleteProduct',
  'editKanbanPhases',
  'viewSubmissions',
  'moveSubmissionPhase',
  'accessPeopleTab',
  'manageUsers',
  'editOrganization',
  'launchSponsoredCampaign',
  'viewMetrics',
];

const roles = {
  'org-001': [
    {
      id: 'role-admin',
      name: 'Administrador',
      description: 'Todas as permissões ativas',
      membersCount: 1,
      permissions: DEFAULT_PERMISSIONS.map((action) => ({ action, allowed: true })),
    },
    {
      id: 'role-recruiter',
      name: 'Recrutador',
      description: 'Gerencia Produtos do tipo Vaga e suas Triagens',
      membersCount: 2,
      permissions: DEFAULT_PERMISSIONS.map((action) => ({
        action,
        allowed: ['createProduct', 'editProduct', 'moveProductPhase', 'viewSubmissions', 'moveSubmissionPhase', 'viewMetrics'].includes(action),
      })),
    },
    {
      id: 'role-viewer',
      name: 'Visualizador',
      description: 'Apenas leitura',
      membersCount: 0,
      permissions: DEFAULT_PERMISSIONS.map((action) => ({
        action,
        allowed: ['viewSubmissions', 'viewMetrics'].includes(action),
      })),
    },
  ],
};

const members = {
  'org-001': [
    {
      id: 'mem-001',
      organizationId: 'org-001',
      name: 'Marina Lima',
      email: 'marina@nubank.com.br',
      avatarUrl: 'https://i.pravatar.cc/120?u=mem-001',
      roleId: 'role-admin',
      roleName: 'Administrador',
      status: 'active',
      invitedAt: '2025-01-10T12:00:00.000Z',
      acceptedAt: '2025-01-10T13:00:00.000Z',
    },
    {
      id: 'mem-002',
      organizationId: 'org-001',
      name: 'Carlos Diniz',
      email: 'carlos@nubank.com.br',
      avatarUrl: 'https://i.pravatar.cc/120?u=mem-002',
      roleId: 'role-recruiter',
      roleName: 'Recrutador',
      status: 'active',
      invitedAt: '2025-01-15T09:00:00.000Z',
      acceptedAt: '2025-01-15T10:00:00.000Z',
    },
  ],
};

const groups = {
  'org-001': [
    {
      id: 'grp-rh',
      organizationId: 'org-001',
      name: 'RH',
      description: 'Time de recrutamento',
      defaultRoleId: 'role-recruiter',
      defaultRoleName: 'Recrutador',
      membersCount: 2,
    },
  ],
};

// ---------- Creators & Creator Groups ----------
// Creators institucionalizados vinculados à organização (autores dos pitches).
// Distintos de members/roles (staff interno). Grupos de creators agrupam-nos
// para liberar produtos em lote (ex.: "Webiner Nubank").

const creators = {
  'org-001': [
    {
      id: 'creator-001',
      organizationId: 'org-001',
      handle: 'amanda.silva',
      displayName: 'Amanda Silva',
      avatarUrl: 'https://i.pravatar.cc/120?u=creator-001',
      headline: 'Engenheira de Software · Creator institucionalizada',
      status: 'active',
      joinedAt: '2025-02-01T12:00:00.000Z',
    },
    {
      id: 'creator-002',
      organizationId: 'org-001',
      handle: 'bruno.costa',
      displayName: 'Bruno Costa',
      avatarUrl: 'https://i.pravatar.cc/120?u=creator-002',
      headline: 'Tech Recruiter · Conteúdo de carreira',
      status: 'active',
      joinedAt: '2025-02-10T12:00:00.000Z',
    },
    {
      id: 'creator-003',
      organizationId: 'org-001',
      handle: 'carla.menezes',
      displayName: 'Carla Menezes',
      avatarUrl: 'https://i.pravatar.cc/120?u=creator-003',
      headline: 'Especialista em Produtos PJ',
      status: 'active',
      joinedAt: '2025-03-05T12:00:00.000Z',
    },
    {
      id: 'creator-004',
      organizationId: 'org-001',
      handle: 'diego.ramos',
      displayName: 'Diego Ramos',
      avatarUrl: 'https://i.pravatar.cc/120?u=creator-004',
      headline: 'Creator convidado',
      status: 'invited',
      joinedAt: '2025-04-20T12:00:00.000Z',
    },
  ],
};

const creatorGroups = {
  'org-001': [
    {
      id: 'cgrp-001',
      organizationId: 'org-001',
      name: 'Webiner Nubank',
      description: 'Creators que produzem conteúdo para webinars e vagas de engenharia.',
      creatorIds: ['creator-001', 'creator-002'],
      creatorsCount: 2,
      createdAt: '2025-03-01T12:00:00.000Z',
      updatedAt: '2025-03-01T12:00:00.000Z',
    },
    {
      id: 'cgrp-002',
      organizationId: 'org-001',
      name: 'Conteúdo Comercial',
      description: 'Creators focados em produtos e serviços.',
      creatorIds: ['creator-003'],
      creatorsCount: 1,
      createdAt: '2025-03-08T12:00:00.000Z',
      updatedAt: '2025-03-08T12:00:00.000Z',
    },
  ],
};

// ---------- Helpers ----------

function findOrganization(slug) {
  return organizations.find((o) => o.slug === slug);
}

function computeOrgCounters(orgId) {
  const orgProducts = products.filter((p) => p.organizationId === orgId);
  const orgSubmissions = submissions.filter((s) => s.organizationId === orgId);
  const orgMembers = members[orgId] || [];
  return {
    productsCount: orgProducts.length,
    submissionsCount: orgSubmissions.length,
    membersCount: orgMembers.length,
  };
}

function serializeOrganization(org) {
  const counters = computeOrgCounters(org.id);
  return { ...org, ...counters };
}

function listOrganizations({ page = 1, pageSize = 20 }) {
  const total = organizations.length;
  const start = (page - 1) * pageSize;
  const items = organizations.slice(start, start + pageSize).map(serializeOrganization);
  return { items, total, page, pageSize };
}

function createOrganization(payload) {
  if (!payload.name || !payload.corporateEmail || !payload.slug) {
    return { ok: false, code: 'missing-fields' };
  }
  if (organizations.find((o) => o.slug === payload.slug)) {
    return { ok: false, code: 'slug-taken' };
  }
  const now = NOW();
  const org = {
    id: `org-${Date.now()}`,
    slug: payload.slug,
    name: payload.name,
    corporateEmail: payload.corporateEmail,
    website: payload.website || '',
    socialLinks: payload.socialLinks || [],
    bannerUrl: payload.bannerUrl || '',
    logoUrl: payload.logoUrl || '',
    about: payload.about || '',
    publicPageEnabled: false,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };
  organizations.push(org);
  roles[org.id] = [];
  members[org.id] = [];
  groups[org.id] = [];
  return { ok: true, organization: serializeOrganization(org) };
}

function updateOrganization(slug, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'not-found' };
  Object.assign(org, {
    name: payload.name ?? org.name,
    website: payload.website ?? org.website,
    socialLinks: payload.socialLinks ?? org.socialLinks,
    bannerUrl: payload.bannerUrl ?? org.bannerUrl,
    logoUrl: payload.logoUrl ?? org.logoUrl,
    about: payload.about ?? org.about,
    publicPageEnabled: payload.publicPageEnabled ?? org.publicPageEnabled,
    updatedAt: NOW(),
  });
  return { ok: true, organization: serializeOrganization(org) };
}

function toggleFavorite(slug) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'not-found' };
  org.isFavorite = !org.isFavorite;
  org.updatedAt = NOW();
  return { ok: true, organization: serializeOrganization(org) };
}

// Departments

function findDepartment(orgSlug, deptSlug) {
  const org = findOrganization(orgSlug);
  if (!org) return null;
  return departments.find((d) => d.organizationId === org.id && d.slug === deptSlug) || null;
}

function computeDeptCounters(dept) {
  const deptProducts = products.filter((p) => p.departmentId === dept.id);
  const productIds = new Set(deptProducts.map((p) => p.id));
  const deptSubmissions = submissions.filter((s) => productIds.has(s.productId));
  return {
    productsCount: deptProducts.length,
    submissionsCount: deptSubmissions.length,
    membersCount: dept.membersCount || 0,
  };
}

function serializeDepartment(dept) {
  const { membersCount, ...rest } = dept;
  return { ...rest, ...computeDeptCounters(dept) };
}

function listDepartments(orgSlug, { page = 1, pageSize = 50 }) {
  const org = findOrganization(orgSlug);
  if (!org) return null;
  const all = departments.filter((d) => d.organizationId === org.id);
  const total = all.length;
  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize).map(serializeDepartment);
  return { items, total, page, pageSize };
}

function createDepartment(orgSlug, payload) {
  const org = findOrganization(orgSlug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!payload.name || !payload.slug) return { ok: false, code: 'missing-fields' };
  if (departments.find((d) => d.organizationId === org.id && d.slug === payload.slug)) {
    return { ok: false, code: 'slug-taken' };
  }
  const now = NOW();
  const dept = {
    id: `dept-${Date.now()}`,
    organizationId: org.id,
    slug: payload.slug,
    name: payload.name,
    description: payload.description || '',
    icon: payload.icon || 'workspaces',
    color: payload.color || '#2563eb',
    isFavorite: false,
    membersCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  departments.push(dept);
  return { ok: true, department: serializeDepartment(dept) };
}

function updateDepartment(orgSlug, deptSlug, payload) {
  const dept = findDepartment(orgSlug, deptSlug);
  if (!dept) return { ok: false, code: 'not-found' };
  Object.assign(dept, {
    name: payload.name ?? dept.name,
    description: payload.description ?? dept.description,
    icon: payload.icon ?? dept.icon,
    color: payload.color ?? dept.color,
    updatedAt: NOW(),
  });
  return { ok: true, department: serializeDepartment(dept) };
}

function toggleDepartmentFavorite(orgSlug, deptSlug) {
  const dept = findDepartment(orgSlug, deptSlug);
  if (!dept) return { ok: false, code: 'not-found' };
  dept.isFavorite = !dept.isFavorite;
  dept.updatedAt = NOW();
  return { ok: true, department: serializeDepartment(dept) };
}

// Products

function listProducts(slug, { type, phase, department, page = 1, pageSize = 50 }) {
  const org = findOrganization(slug);
  if (!org) return null;
  let items = products.filter((p) => p.organizationId === org.id);
  if (department) {
    const dept = departments.find((d) => d.organizationId === org.id && d.slug === department);
    items = items.filter((p) => p.departmentId === (dept ? dept.id : null));
  }
  if (type) items = items.filter((p) => p.type === type);
  if (phase) items = items.filter((p) => p.phase === phase);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

function getProduct(slug, id) {
  const org = findOrganization(slug);
  if (!org) return null;
  return products.find((p) => p.organizationId === org.id && p.id === id) || null;
}

function createProduct(slug, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!payload.type || !PRODUCT_TYPES.includes(payload.type)) {
    return { ok: false, code: 'invalid-type' };
  }
  if (!payload.title) return { ok: false, code: 'missing-title' };
  const now = NOW();
  const dept = payload.department
    ? departments.find((d) => d.organizationId === org.id && d.slug === payload.department)
    : null;
  const product = {
    id: `prod-${Date.now()}`,
    organizationId: org.id,
    departmentId: dept ? dept.id : null,
    type: payload.type,
    phase: 'backlog',
    title: payload.title,
    subtitle: payload.subtitle || '',
    badges: payload.badges || [],
    location: payload.location || '',
    description: payload.description || [],
    screeningQuestions: payload.screeningQuestions || [],
    learnMoreConfig: payload.learnMoreConfig || makeLearnMoreConfig(payload.type),
    eligibility: normalizeEligibility(payload.eligibility),
    metrics: { views: 0, submissions: 0 },
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  return { ok: true, product };
}

function updateProduct(slug, id, payload) {
  const product = getProduct(slug, id);
  if (!product) return { ok: false, code: 'not-found' };
  Object.assign(product, {
    title: payload.title ?? product.title,
    subtitle: payload.subtitle ?? product.subtitle,
    badges: payload.badges ?? product.badges,
    location: payload.location ?? product.location,
    description: payload.description ?? product.description,
    screeningQuestions: payload.screeningQuestions ?? product.screeningQuestions,
    learnMoreConfig: payload.learnMoreConfig ?? product.learnMoreConfig,
    eligibility: payload.eligibility ? normalizeEligibility(payload.eligibility) : product.eligibility,
    phase: payload.phase ?? product.phase,
    updatedAt: NOW(),
  });
  return { ok: true, product };
}

function moveProduct(slug, id, phase) {
  if (!PRODUCT_PHASES.includes(phase)) return { ok: false, code: 'invalid-phase' };
  const product = getProduct(slug, id);
  if (!product) return { ok: false, code: 'not-found' };
  product.phase = phase;
  product.updatedAt = NOW();
  if (phase === 'in_campaign' && !product.publishedAt) {
    product.publishedAt = NOW();
  }
  return { ok: true, product };
}

// Submissions

function listSubmissions(slug, query) {
  const org = findOrganization(slug);
  if (!org) return null;
  let items = submissions.filter((s) => s.organizationId === org.id);
  if (query.department) {
    const dept = departments.find((d) => d.organizationId === org.id && d.slug === query.department);
    const deptProductIds = new Set(
      products.filter((p) => p.departmentId === (dept ? dept.id : null)).map((p) => p.id),
    );
    items = items.filter((s) => deptProductIds.has(s.productId));
  }
  if (query.productType) items = items.filter((s) => s.productType === query.productType);
  if (query.productId) items = items.filter((s) => s.productId === query.productId);
  if (query.assignedTo) items = items.filter((s) => s.assignedTo === query.assignedTo);
  if (query.search) {
    const term = String(query.search).toLowerCase();
    items = items.filter(
      (s) =>
        s.candidate.name.toLowerCase().includes(term) ||
        s.candidate.email.toLowerCase().includes(term),
    );
  }
  const page = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 50));
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

function getSubmission(slug, id) {
  const org = findOrganization(slug);
  if (!org) return null;
  return submissions.find((s) => s.organizationId === org.id && s.id === id) || null;
}

function createSubmission(slug, productId, payload) {
  const product = getProduct(slug, productId);
  if (!product) return { ok: false, code: 'product-not-found' };
  const initialPhase = INITIAL_PHASE_BY_TYPE[product.type];
  const answers = (payload.answers || []).map(({ fieldId, value }) => {
    const fieldDef = findFieldDef(product, fieldId);
    return { fieldId, label: fieldDef?.label || fieldId, value };
  });
  const screeningAnswers = (payload.screeningAnswers || []).map(({ questionId, answer }) => {
    const q = product.screeningQuestions.find((sq) => sq.id === questionId);
    return {
      questionId,
      question: q?.question || '',
      idealAnswer: q?.idealAnswer || '',
      answer,
      required: q?.required || false,
      matchesIdeal: q ? String(answer).toLowerCase() === String(q.idealAnswer).toLowerCase() : false,
    };
  });
  const now = NOW();
  const id = `sub-${Date.now()}`;
  const submission = {
    id,
    organizationId: product.organizationId,
    productId,
    productType: product.type,
    productTitle: product.title,
    phase: initialPhase,
    candidate: {
      name: (answers.find((a) => a.fieldId === 'name') || {}).value || 'Anônimo',
      email: (answers.find((a) => a.fieldId === 'email') || {}).value || '',
      avatarUrl: `https://i.pravatar.cc/120?u=${encodeURIComponent(id)}`,
      contextLine: '',
    },
    source: resolveSubmissionSource(product.organizationId, payload.source),
    answers,
    screeningAnswers,
    internalNotes: '',
    assignedTo: null,
    history: [
      {
        id: `h-${id}-1`,
        actor: 'Público',
        action: 'Submissão recebida via Saiba Mais',
        fromPhase: null,
        toPhase: initialPhase,
        note: '',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  submissions.push(submission);
  refreshProductMetrics();
  return { ok: true, submission };
}

function findFieldDef(product, fieldId) {
  for (const step of product.learnMoreConfig.steps) {
    const f = step.fields.find((field) => field.id === fieldId);
    if (f) return f;
  }
  return null;
}

function moveSubmission(slug, id, phase) {
  const submission = getSubmission(slug, id);
  if (!submission) return { ok: false, code: 'not-found' };
  const allowedPhases = SUBMISSION_PHASES_BY_TYPE[submission.productType] || [];
  if (!allowedPhases.includes(phase)) return { ok: false, code: 'invalid-phase' };
  const fromPhase = submission.phase;
  submission.phase = phase;
  submission.updatedAt = NOW();
  submission.history.push({
    id: `h-${id}-${submission.history.length + 1}`,
    actor: 'Operador',
    action: 'Movido para nova fase',
    fromPhase,
    toPhase: phase,
    note: '',
    createdAt: NOW(),
  });
  return { ok: true, submission };
}

function addSubmissionNote(slug, id, note) {
  const submission = getSubmission(slug, id);
  if (!submission) return { ok: false, code: 'not-found' };
  submission.internalNotes = note;
  submission.updatedAt = NOW();
  submission.history.push({
    id: `h-${id}-${submission.history.length + 1}`,
    actor: 'Operador',
    action: 'Nota interna adicionada',
    fromPhase: null,
    toPhase: null,
    note,
    createdAt: NOW(),
  });
  return { ok: true, submission };
}

function assignSubmission(slug, id, memberId) {
  const submission = getSubmission(slug, id);
  if (!submission) return { ok: false, code: 'not-found' };
  submission.assignedTo = memberId;
  submission.updatedAt = NOW();
  return { ok: true, submission };
}

// Members / Roles / Groups

function listMembers(slug) {
  const org = findOrganization(slug);
  if (!org) return null;
  const items = members[org.id] || [];
  return { items, total: items.length, page: 1, pageSize: items.length || 1 };
}

function inviteMember(slug, { email, roleId }) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!email || !roleId) return { ok: false, code: 'missing-fields' };
  const role = (roles[org.id] || []).find((r) => r.id === roleId);
  if (!role) return { ok: false, code: 'role-not-found' };
  const id = `mem-${Date.now()}`;
  const member = {
    id,
    organizationId: org.id,
    name: email.split('@')[0],
    email,
    avatarUrl: `https://i.pravatar.cc/120?u=${id}`,
    roleId,
    roleName: role.name,
    status: 'pending',
    invitedAt: NOW(),
    acceptedAt: null,
  };
  members[org.id] = [...(members[org.id] || []), member];
  role.membersCount += 1;
  return { ok: true, member };
}

function updateMember(slug, id, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const member = (members[org.id] || []).find((m) => m.id === id);
  if (!member) return { ok: false, code: 'not-found' };
  if (payload.roleId) {
    const role = (roles[org.id] || []).find((r) => r.id === payload.roleId);
    if (!role) return { ok: false, code: 'role-not-found' };
    const previousRole = (roles[org.id] || []).find((r) => r.id === member.roleId);
    if (previousRole) previousRole.membersCount = Math.max(0, previousRole.membersCount - 1);
    role.membersCount += 1;
    member.roleId = role.id;
    member.roleName = role.name;
  }
  return { ok: true, member };
}

function listRoles(slug) {
  const org = findOrganization(slug);
  if (!org) return null;
  return roles[org.id] || [];
}

function createRole(slug, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!payload.name) return { ok: false, code: 'missing-name' };
  const allowedMap = new Map((payload.permissions || []).map((p) => [p.action, !!p.allowed]));
  const role = {
    id: `role-${Date.now()}`,
    name: payload.name,
    description: payload.description || '',
    membersCount: 0,
    permissions: DEFAULT_PERMISSIONS.map((action) => ({
      action,
      allowed: allowedMap.get(action) ?? false,
    })),
  };
  if (!roles[org.id]) roles[org.id] = [];
  roles[org.id].push(role);
  return { ok: true, role };
}

function updateRole(slug, id, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const role = (roles[org.id] || []).find((r) => r.id === id);
  if (!role) return { ok: false, code: 'not-found' };
  Object.assign(role, {
    name: payload.name ?? role.name,
    description: payload.description ?? role.description,
    permissions: payload.permissions ?? role.permissions,
  });
  return { ok: true, role };
}

function listGroups(slug) {
  const org = findOrganization(slug);
  if (!org) return null;
  return groups[org.id] || [];
}

function createGroup(slug, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!payload.name) return { ok: false, code: 'missing-name' };
  const defaultRole = payload.defaultRoleId
    ? (roles[org.id] || []).find((r) => r.id === payload.defaultRoleId)
    : null;
  const group = {
    id: `grp-${Date.now()}`,
    organizationId: org.id,
    name: payload.name,
    description: payload.description || '',
    defaultRoleId: defaultRole ? defaultRole.id : null,
    defaultRoleName: defaultRole ? defaultRole.name : null,
    membersCount: 0,
  };
  groups[org.id] = [...(groups[org.id] || []), group];
  return { ok: true, group };
}

function updateGroup(slug, id, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const group = (groups[org.id] || []).find((g) => g.id === id);
  if (!group) return { ok: false, code: 'not-found' };
  Object.assign(group, {
    name: payload.name ?? group.name,
    description: payload.description ?? group.description,
    defaultRoleId: payload.defaultRoleId ?? group.defaultRoleId,
  });
  if (payload.defaultRoleId) {
    const role = (roles[org.id] || []).find((r) => r.id === payload.defaultRoleId);
    group.defaultRoleName = role ? role.name : null;
  }
  return { ok: true, group };
}

function addMembersToGroup(slug, id, memberIds) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const group = (groups[org.id] || []).find((g) => g.id === id);
  if (!group) return { ok: false, code: 'not-found' };
  const valid = (memberIds || []).filter((mid) =>
    (members[org.id] || []).some((m) => m.id === mid),
  );
  group.membersCount += valid.length;
  if (group.defaultRoleId) {
    const role = (roles[org.id] || []).find((r) => r.id === group.defaultRoleId);
    if (role) {
      for (const mid of valid) {
        const member = members[org.id].find((m) => m.id === mid);
        if (member && member.roleId !== role.id) {
          const previousRole = roles[org.id].find((r) => r.id === member.roleId);
          if (previousRole) previousRole.membersCount = Math.max(0, previousRole.membersCount - 1);
          role.membersCount += 1;
          member.roleId = role.id;
          member.roleName = role.name;
        }
      }
    }
  }
  return { ok: true, group };
}

// ---------- Creators & Creator Groups ----------

function resolveSubmissionSource(orgId, raw) {
  if (!raw || !raw.creatorId) return null;
  const creator = (creators[orgId] || []).find((c) => c.id === raw.creatorId);
  return {
    creatorId: raw.creatorId,
    creatorName: raw.creatorName || (creator ? creator.displayName : ''),
    creatorHandle: raw.creatorHandle || (creator ? creator.handle : ''),
    pitchId: raw.pitchId || null,
    pitchTitle: raw.pitchTitle || '',
  };
}

function listCreators(slug) {
  const org = findOrganization(slug);
  if (!org) return null;
  return creators[org.id] || [];
}

function listCreatorGroups(slug) {
  const org = findOrganization(slug);
  if (!org) return null;
  return creatorGroups[org.id] || [];
}

function createCreatorGroup(slug, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  if (!payload.name) return { ok: false, code: 'missing-name' };
  const validIds = (payload.creatorIds || []).filter((cid) =>
    (creators[org.id] || []).some((c) => c.id === cid),
  );
  const now = NOW();
  const group = {
    id: `cgrp-${Date.now()}`,
    organizationId: org.id,
    name: payload.name,
    description: payload.description || '',
    creatorIds: validIds,
    creatorsCount: validIds.length,
    createdAt: now,
    updatedAt: now,
  };
  creatorGroups[org.id] = [...(creatorGroups[org.id] || []), group];
  return { ok: true, group };
}

function updateCreatorGroup(slug, id, payload) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const group = (creatorGroups[org.id] || []).find((g) => g.id === id);
  if (!group) return { ok: false, code: 'not-found' };
  Object.assign(group, {
    name: payload.name ?? group.name,
    description: payload.description ?? group.description,
    updatedAt: NOW(),
  });
  return { ok: true, group };
}

function addCreatorsToGroup(slug, id, creatorIds) {
  const org = findOrganization(slug);
  if (!org) return { ok: false, code: 'org-not-found' };
  const group = (creatorGroups[org.id] || []).find((g) => g.id === id);
  if (!group) return { ok: false, code: 'not-found' };
  const valid = (creatorIds || []).filter(
    (cid) =>
      (creators[org.id] || []).some((c) => c.id === cid) && !group.creatorIds.includes(cid),
  );
  group.creatorIds = [...group.creatorIds, ...valid];
  group.creatorsCount = group.creatorIds.length;
  group.updatedAt = NOW();
  return { ok: true, group };
}

// Produtos que um creator está habilitado a vender (regra de elegibilidade).
function listProductsForCreator(slug, creatorId) {
  const org = findOrganization(slug);
  if (!org) return null;
  const groupIdsOfCreator = (creatorGroups[org.id] || [])
    .filter((g) => g.creatorIds.includes(creatorId))
    .map((g) => g.id);
  return products.filter((p) => {
    if (p.organizationId !== org.id) return false;
    const e = p.eligibility || { mode: 'any', creatorIds: [], groupIds: [] };
    if (e.mode === 'any') return true;
    if (e.mode === 'creators') return e.creatorIds.includes(creatorId);
    if (e.mode === 'groups') return e.groupIds.some((gid) => groupIdsOfCreator.includes(gid));
    return false;
  });
}

module.exports = {
  listOrganizations,
  findOrganization,
  serializeOrganization,
  createOrganization,
  updateOrganization,
  toggleFavorite,
  listDepartments,
  findDepartment,
  serializeDepartment,
  createDepartment,
  updateDepartment,
  toggleDepartmentFavorite,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  moveProduct,
  listSubmissions,
  getSubmission,
  createSubmission,
  moveSubmission,
  addSubmissionNote,
  assignSubmission,
  listMembers,
  inviteMember,
  updateMember,
  listRoles,
  createRole,
  updateRole,
  listGroups,
  createGroup,
  updateGroup,
  addMembersToGroup,
  listCreators,
  listCreatorGroups,
  createCreatorGroup,
  updateCreatorGroup,
  addCreatorsToGroup,
  listProductsForCreator,
};
