/**
 * Mock data: filter attributes per catalog key.
 * Structure mirrors IAttribute from the Angular client:
 *   { key, name, filterComponent: { type, options[] } }
 */

const CONTENT_ATTRIBUTES = [
  {
    key: 'tipo',
    name: 'Tipo',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Vídeo', value: 'video' },
        { label: 'Artigo', value: 'article' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Infográfico', value: 'infographic' },
      ],
    },
  },
  {
    key: 'tema',
    name: 'Tema',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Tecnologia', value: 'tech' },
        { label: 'Negócios', value: 'business' },
        { label: 'Carreira', value: 'career' },
        { label: 'Inovação', value: 'innovation' },
        { label: 'Liderança', value: 'leadership' },
      ],
    },
  },
  {
    key: 'duracaoVideo',
    name: 'Duração do Vídeo',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Até 1 minuto', value: 'lt1' },
        { label: '1 – 5 minutos', value: '1to5' },
        { label: '5 – 10 minutos', value: '5to10' },
        { label: '10 – 30 minutos', value: '10to30' },
        { label: 'Acima de 30 minutos', value: 'gt30' },
      ],
    },
  },
  {
    key: 'idioma',
    name: 'Idioma',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Português', value: 'pt' },
        { label: 'Inglês', value: 'en' },
        { label: 'Espanhol', value: 'es' },
      ],
    },
  },
  {
    key: 'dataPublicacao',
    name: 'Data de Publicação',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Últimas 24 horas', value: 'last24h' },
        { label: 'Última semana', value: 'lastWeek' },
        { label: 'Último mês', value: 'lastMonth' },
        { label: 'Qualquer data', value: 'any' },
      ],
    },
  },
  {
    key: 'popularidade',
    name: 'Popularidade',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Mais recentes', value: 'newest' },
        { label: 'Mais relevantes', value: 'relevant' },
        { label: 'Mais visualizados', value: 'mostViewed' },
      ],
    },
  },
  {
    key: 'origemConteudo',
    name: 'Origem do Conteúdo',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Interno', value: 'internal' },
        { label: 'Externo', value: 'external' },
      ],
    },
  },
];

const VACANCIES_ATTRIBUTES = [
  {
    key: 'dataAnuncio',
    name: 'Data do anúncio',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Últimas 24 horas', value: 'last24h' },
        { label: 'Última semana', value: 'lastWeek' },
        { label: 'Último mês', value: 'lastMonth' },
        { label: 'Qualquer data', value: 'any' },
      ],
    },
  },
  {
    key: 'nivelExperiencia',
    name: 'Nível de experiência',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Estágio', value: 'internship' },
        { label: 'Assistente', value: 'assistant' },
        { label: 'Júnior', value: 'junior' },
        { label: 'Pleno', value: 'midLevel' },
        { label: 'Sênior', value: 'senior' },
        { label: 'Executivo', value: 'executive' },
        { label: 'Diretor', value: 'director' },
      ],
    },
  },
  {
    key: 'tipoTrabalho',
    name: 'Tipo de trabalho',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Presencial', value: 'inPerson' },
        { label: 'Remoto', value: 'remote' },
        { label: 'Híbrido', value: 'hybrid' },
      ],
    },
  },
  {
    key: 'classificarPor',
    name: 'Classificar por',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Mais recentes', value: 'mostRecent' },
        { label: 'Mais relevantes', value: 'mostRelevant' },
      ],
    },
  },
  {
    key: 'localidade',
    name: 'Localidade',
    filterComponent: {
      type: 'select',
      options: [
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Remoto', value: 'remote' },
        { label: 'Qualquer', value: 'any' },
      ],
    },
  },
];

const NEWS_ATTRIBUTES = [
  {
    key: 'tema',
    name: 'Tema',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Mercado de Trabalho', value: 'mercadoTrabalho' },
        { label: 'Economia', value: 'economia' },
        { label: 'Tecnologia', value: 'tecnologia' },
        { label: 'Startups', value: 'startups' },
        { label: 'Negócios', value: 'negocios' },
        { label: 'Recursos Humanos', value: 'recursosHumanos' },
        { label: 'Educação', value: 'educacao' },
        { label: 'Carreira', value: 'carreira' },
        { label: 'Inovação', value: 'inovacao' },
        { label: 'Cultura Corporativa', value: 'culturaCorporativa' },
        { label: 'Legislação & Direitos', value: 'legislacaoDireitos' },
      ],
    },
  },
  {
    key: 'tipoConteudo',
    name: 'Tipo de Conteúdo',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Notícia', value: 'noticia' },
        { label: 'Artigo', value: 'artigo' },
        { label: 'Opinião', value: 'opiniao' },
        { label: 'Entrevista', value: 'entrevista' },
        { label: 'Análise', value: 'analise' },
        { label: 'Release / Institucional', value: 'releaseInstitucional' },
      ],
    },
  },
  {
    key: 'dataPublicacao',
    name: 'Data de Publicação',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Últimas 24 horas', value: 'last24h' },
        { label: 'Última semana', value: 'lastWeek' },
        { label: 'Último mês', value: 'lastMonth' },
        { label: 'Qualquer data', value: 'any' },
      ],
    },
  },
  {
    key: 'relevancia',
    name: 'Relevância',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Mais recentes', value: 'maisRecentes' },
        { label: 'Mais lidas', value: 'maisLidas' },
        { label: 'Mais comentadas', value: 'maisComentadas' },
        { label: 'Em destaque', value: 'emDestaque' },
      ],
    },
  },
];

const TRAINING_ATTRIBUTES = [
  {
    key: 'tipo',
    name: 'Tipo',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Curso', value: 'course' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Bootcamp', value: 'bootcamp' },
        { label: 'Mentoria', value: 'mentoring' },
        { label: 'Certificação', value: 'certification' },
      ],
    },
  },
  {
    key: 'nivel',
    name: 'Nível',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Iniciante', value: 'beginner' },
        { label: 'Intermediário', value: 'intermediate' },
        { label: 'Avançado', value: 'advanced' },
      ],
    },
  },
  {
    key: 'duracao',
    name: 'Duração',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Até 4 horas', value: 'lt4h' },
        { label: '4 – 10 horas', value: '4to10h' },
        { label: '10 – 40 horas', value: '10to40h' },
        { label: 'Acima de 40 horas', value: 'gt40h' },
      ],
    },
  },
  {
    key: 'modalidade',
    name: 'Modalidade',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Online ao vivo', value: 'liveOnline' },
        { label: 'Online gravado', value: 'recorded' },
        { label: 'Presencial', value: 'inPerson' },
        { label: 'Híbrido', value: 'hybrid' },
      ],
    },
  },
  {
    key: 'idioma',
    name: 'Idioma',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Português', value: 'pt' },
        { label: 'Inglês', value: 'en' },
        { label: 'Espanhol', value: 'es' },
      ],
    },
  },
];

const CATALOGS = [
  { key: 'product',    label: 'Produto',      attributesSource: 'api' },
  { key: 'content',    label: 'Conteúdo',     attributesSource: 'api' },
  { key: 'vacancies',  label: 'Vagas',        attributesSource: 'api' },
  { key: 'people',     label: 'Pessoas',      attributesSource: 'api' },
  { key: 'enterprise', label: 'Empresa',      attributesSource: 'api' },
  { key: 'training',   label: 'Treinamento',  attributesSource: 'api' },
  { key: 'news',       label: 'Noticias',     attributesSource: 'api' },
];

const PEOPLE_ATTRIBUTES = [
  {
    key: 'area',
    name: 'Área de atuação',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Tecnologia', value: 'tech' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Vendas', value: 'sales' },
        { label: 'Recursos Humanos', value: 'hr' },
        { label: 'Finanças', value: 'finance' },
        { label: 'Design', value: 'design' },
        { label: 'Produto', value: 'product' },
        { label: 'Operações', value: 'operations' },
      ],
    },
  },
  {
    key: 'nivelSenioridade',
    name: 'Nível de senioridade',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Estágio', value: 'internship' },
        { label: 'Júnior', value: 'junior' },
        { label: 'Pleno', value: 'midLevel' },
        { label: 'Sênior', value: 'senior' },
        { label: 'Liderança', value: 'leadership' },
        { label: 'C-Level', value: 'cLevel' },
      ],
    },
  },
  {
    key: 'localidade',
    name: 'Localidade',
    filterComponent: {
      type: 'select',
      options: [
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Remoto', value: 'remote' },
        { label: 'Qualquer', value: 'any' },
      ],
    },
  },
  {
    key: 'disponibilidade',
    name: 'Disponibilidade',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Imediata', value: 'immediate' },
        { label: 'Em até 30 dias', value: 'within30' },
        { label: 'Em até 90 dias', value: 'within90' },
        { label: 'Não disponível', value: 'unavailable' },
      ],
    },
  },
];

const ENTERPRISE_ATTRIBUTES = [
  {
    key: 'setor',
    name: 'Setor',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Tecnologia', value: 'tech' },
        { label: 'Saúde', value: 'health' },
        { label: 'Finanças', value: 'finance' },
        { label: 'Educação', value: 'education' },
        { label: 'Varejo', value: 'retail' },
        { label: 'Indústria', value: 'industry' },
        { label: 'Logística', value: 'logistics' },
        { label: 'Agronegócio', value: 'agribusiness' },
      ],
    },
  },
  {
    key: 'porte',
    name: 'Porte da empresa',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Startup', value: 'startup' },
        { label: 'Pequena (até 50 func.)', value: 'small' },
        { label: 'Média (50–500 func.)', value: 'medium' },
        { label: 'Grande (500+ func.)', value: 'large' },
        { label: 'Multinacional', value: 'multinational' },
      ],
    },
  },
  {
    key: 'localidade',
    name: 'Localidade',
    filterComponent: {
      type: 'select',
      options: [
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Belo Horizonte', value: 'bh' },
        { label: 'Curitiba', value: 'cwb' },
        { label: 'Qualquer', value: 'any' },
      ],
    },
  },
  {
    key: 'modeloTrabalho',
    name: 'Modelo de trabalho',
    filterComponent: {
      type: 'checkbox',
      options: [
        { label: 'Presencial', value: 'inPerson' },
        { label: 'Remoto', value: 'remote' },
        { label: 'Híbrido', value: 'hybrid' },
      ],
    },
  },
  {
    key: 'vagasAbertas',
    name: 'Com vagas abertas',
    filterComponent: {
      type: 'radio',
      options: [
        { label: 'Sim', value: 'yes' },
        { label: 'Não', value: 'no' },
        { label: 'Indiferente', value: 'any' },
      ],
    },
  },
];

const CATALOG_FILTER_ATTRIBUTES = {
  'for-you': [],
  product: CONTENT_ATTRIBUTES,
  content: CONTENT_ATTRIBUTES,
  vacancies: VACANCIES_ATTRIBUTES,
  people: PEOPLE_ATTRIBUTES,
  enterprise: ENTERPRISE_ATTRIBUTES,
  training: TRAINING_ATTRIBUTES,
  news: NEWS_ATTRIBUTES,
};

module.exports = { CATALOGS, CATALOG_FILTER_ATTRIBUTES };
