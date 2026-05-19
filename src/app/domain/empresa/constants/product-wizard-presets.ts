import { ProductType } from '@shared/enums/product-type.enum';

export type FieldKind = 'text' | 'select' | 'textarea';

export interface WizardFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface WizardField {
  readonly key: string;
  readonly label: string;
  readonly kind: FieldKind;
  readonly placeholder?: string;
  readonly required: boolean;
  readonly options?: readonly WizardFieldOption[];
}

export interface WizardDescriptionBlock {
  readonly key: string;
  readonly title: string;
  readonly placeholder: string;
  readonly required: boolean;
}

// ---------- Etapa 2: Identificação por tipo ----------

const COMMON_LOCATION = {
  key: 'location',
  label: 'Localidade',
  kind: 'text',
  placeholder: 'Ex.: Vitória, ES',
  required: false,
} as const satisfies WizardField;

const JOB_IDENTIFICATION: readonly WizardField[] = [
  {
    key: 'title',
    label: 'Cargo',
    kind: 'text',
    placeholder: 'Ex.: Engenheiro(a) Angular Sênior',
    required: true,
  },
  {
    key: 'workMode',
    label: 'Tipo de local',
    kind: 'select',
    required: true,
    options: [
      { value: 'remote', label: 'Remoto' },
      { value: 'hybrid', label: 'Híbrido' },
      { value: 'on_site', label: 'Presencial' },
    ],
  },
  COMMON_LOCATION,
  {
    key: 'employmentType',
    label: 'Tipo de vaga',
    kind: 'select',
    required: true,
    options: [
      { value: 'full_time', label: 'Tempo integral (CLT)' },
      { value: 'part_time', label: 'Meio período' },
      { value: 'internship', label: 'Estágio' },
      { value: 'contract', label: 'PJ / Contrato' },
      { value: 'freelance', label: 'Freelance' },
    ],
  },
];

const SERVICE_IDENTIFICATION: readonly WizardField[] = [
  {
    key: 'title',
    label: 'Nome do produto/serviço',
    kind: 'text',
    placeholder: 'Ex.: Conta PJ para MEI e PME',
    required: true,
  },
  {
    key: 'category',
    label: 'Categoria',
    kind: 'text',
    placeholder: 'Ex.: Financeiro',
    required: true,
  },
  {
    key: 'priceRange',
    label: 'Faixa de preço',
    kind: 'text',
    placeholder: 'Ex.: Gratuito · R$ 99/mês · Sob consulta',
    required: false,
  },
  {
    key: 'modality',
    label: 'Modalidade',
    kind: 'select',
    required: true,
    options: [
      { value: 'digital', label: 'Digital' },
      { value: 'physical', label: 'Físico' },
      { value: 'recurring', label: 'Assinatura' },
    ],
  },
];

const TRAINING_IDENTIFICATION: readonly WizardField[] = [
  {
    key: 'title',
    label: 'Título do treinamento',
    kind: 'text',
    placeholder: 'Ex.: Workshop: Como o Nubank usa Angular Signals',
    required: true,
  },
  {
    key: 'schedule',
    label: 'Data e horário',
    kind: 'text',
    placeholder: 'Ex.: 24/06/2026 · 19h–21h',
    required: true,
  },
  {
    key: 'format',
    label: 'Formato',
    kind: 'select',
    required: true,
    options: [
      { value: 'online', label: 'Online' },
      { value: 'on_site', label: 'Presencial' },
      { value: 'hybrid', label: 'Híbrido' },
    ],
  },
  {
    key: 'workload',
    label: 'Carga horária',
    kind: 'text',
    placeholder: 'Ex.: 2h',
    required: false,
  },
  {
    key: 'level',
    label: 'Nível',
    kind: 'select',
    required: true,
    options: [
      { value: 'beginner', label: 'Iniciante' },
      { value: 'intermediate', label: 'Intermediário' },
      { value: 'advanced', label: 'Avançado' },
    ],
  },
];

const NEWS_IDENTIFICATION: readonly WizardField[] = [
  {
    key: 'title',
    label: 'Manchete',
    kind: 'text',
    placeholder: 'Ex.: Release Notes Q1/2026',
    required: true,
  },
  {
    key: 'editorialCategory',
    label: 'Categoria editorial',
    kind: 'text',
    placeholder: 'Ex.: Produto',
    required: true,
  },
  {
    key: 'author',
    label: 'Autor',
    kind: 'text',
    placeholder: 'Ex.: Time de Produto',
    required: true,
  },
  {
    key: 'publishedDate',
    label: 'Data de publicação',
    kind: 'text',
    placeholder: 'Ex.: 18/05/2026',
    required: true,
  },
];

const EXPERIENCE_IDENTIFICATION: readonly WizardField[] = [
  {
    key: 'title',
    label: 'Nome da experiência',
    kind: 'text',
    placeholder: 'Ex.: Tour pela sede em SP',
    required: true,
  },
  {
    key: 'availableDates',
    label: 'Datas disponíveis',
    kind: 'text',
    placeholder: 'Ex.: Quintas e sextas · 10h–11h',
    required: true,
  },
  COMMON_LOCATION,
  {
    key: 'capacity',
    label: 'Capacidade',
    kind: 'text',
    placeholder: 'Ex.: Até 10 pessoas',
    required: false,
  },
];

export const IDENTIFICATION_PRESETS: Readonly<Record<ProductType, readonly WizardField[]>> = {
  [ProductType.Job]: JOB_IDENTIFICATION,
  [ProductType.Service]: SERVICE_IDENTIFICATION,
  [ProductType.Training]: TRAINING_IDENTIFICATION,
  [ProductType.News]: NEWS_IDENTIFICATION,
  [ProductType.Experience]: EXPERIENCE_IDENTIFICATION,
};

// ---------- Etapa 3: Blocos de descrição por tipo ----------

const JOB_BLOCKS: readonly WizardDescriptionBlock[] = [
  { key: 'activities', title: 'Atividades', placeholder: 'O que essa pessoa fará no dia a dia.', required: true },
  { key: 'requirements', title: 'Requisitos', placeholder: 'Hard skills, anos de experiência, ferramentas.', required: true },
  { key: 'salary', title: 'Salário', placeholder: 'Faixa salarial, modelo de remuneração (opcional).', required: false },
  { key: 'benefits', title: 'Benefícios', placeholder: 'Plano de saúde, PLR, equipamento, etc.', required: false },
  { key: 'free', title: 'Campo livre', placeholder: 'Qualquer informação adicional.', required: false },
];

const SERVICE_BLOCKS: readonly WizardDescriptionBlock[] = [
  { key: 'description', title: 'Descrição', placeholder: 'O que é o produto e qual problema resolve.', required: true },
  { key: 'differentials', title: 'Diferenciais', placeholder: 'O que torna sua solução única.', required: false },
  { key: 'useCases', title: 'Casos de uso', placeholder: 'Cenários típicos onde o produto se aplica.', required: false },
  { key: 'pricing', title: 'Preço e condições', placeholder: 'Modelo comercial, planos, descontos.', required: false },
  { key: 'free', title: 'Campo livre', placeholder: 'Outras informações.', required: false },
];

const TRAINING_BLOCKS: readonly WizardDescriptionBlock[] = [
  { key: 'syllabus', title: 'Ementa', placeholder: 'Tópicos cobertos.', required: true },
  { key: 'audience', title: 'Público-alvo', placeholder: 'Para quem é este treinamento.', required: true },
  { key: 'prerequisites', title: 'Pré-requisitos', placeholder: 'Conhecimentos esperados.', required: false },
  { key: 'material', title: 'Material incluído', placeholder: 'Apostila, gravação, certificado, etc.', required: false },
  { key: 'free', title: 'Campo livre', placeholder: 'Outras informações.', required: false },
];

const NEWS_BLOCKS: readonly WizardDescriptionBlock[] = [
  { key: 'lead', title: 'Lide', placeholder: 'Resumo da notícia em 2-3 linhas.', required: true },
  { key: 'body', title: 'Corpo', placeholder: 'Texto completo da notícia.', required: true },
  { key: 'sources', title: 'Fontes', placeholder: 'Links de referência.', required: false },
  { key: 'tags', title: 'Tags', placeholder: 'Palavras-chave separadas por vírgula.', required: false },
  { key: 'free', title: 'Campo livre', placeholder: 'Notas adicionais.', required: false },
];

const EXPERIENCE_BLOCKS: readonly WizardDescriptionBlock[] = [
  { key: 'script', title: 'Roteiro', placeholder: 'O que acontece na experiência.', required: true },
  { key: 'included', title: 'O que está incluído', placeholder: 'Coffee break, brindes, transporte, etc.', required: false },
  { key: 'bring', title: 'O que levar', placeholder: 'Documento, roupas, equipamentos.', required: false },
  { key: 'cancellation', title: 'Política de cancelamento', placeholder: 'Prazo e regras.', required: false },
  { key: 'free', title: 'Campo livre', placeholder: 'Outras informações.', required: false },
];

export const DESCRIPTION_PRESETS: Readonly<
  Record<ProductType, readonly WizardDescriptionBlock[]>
> = {
  [ProductType.Job]: JOB_BLOCKS,
  [ProductType.Service]: SERVICE_BLOCKS,
  [ProductType.Training]: TRAINING_BLOCKS,
  [ProductType.News]: NEWS_BLOCKS,
  [ProductType.Experience]: EXPERIENCE_BLOCKS,
};

// ---------- Etapa 4: Catálogo de campos do Saiba Mais ----------

export interface LearnMoreFieldOption {
  readonly id: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'select' | 'uploadFile';
  readonly defaultRequired: boolean;
  readonly suggestedFor: readonly ProductType[];
  readonly options?: readonly WizardFieldOption[];
}

export const LEARN_MORE_FIELD_CATALOG: readonly LearnMoreFieldOption[] = [
  { id: 'name', label: 'Nome', type: 'text', defaultRequired: true, suggestedFor: [ProductType.Job, ProductType.Service, ProductType.Training, ProductType.Experience] },
  { id: 'email', label: 'E-mail', type: 'email', defaultRequired: true, suggestedFor: [ProductType.Job, ProductType.Service, ProductType.Training, ProductType.News, ProductType.Experience] },
  { id: 'phone', label: 'Telefone', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Job, ProductType.Service, ProductType.Experience] },
  { id: 'linkedin', label: 'LinkedIn', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Job, ProductType.Service] },
  { id: 'resume', label: 'Currículo (upload)', type: 'uploadFile', defaultRequired: false, suggestedFor: [ProductType.Job] },
  { id: 'city', label: 'Cidade', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Job, ProductType.Experience] },
  { id: 'company', label: 'Empresa', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Service] },
  { id: 'companySize', label: 'Porte da empresa', type: 'select', defaultRequired: false, suggestedFor: [ProductType.Service], options: [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '200+', label: '200+' },
  ] },
  { id: 'budget', label: 'Orçamento estimado', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Service] },
  { id: 'level', label: 'Nível', type: 'select', defaultRequired: false, suggestedFor: [ProductType.Training], options: [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' },
  ] },
  { id: 'motivation', label: 'Motivação', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Training] },
  { id: 'frequency', label: 'Frequência desejada', type: 'select', defaultRequired: false, suggestedFor: [ProductType.News], options: [
    { value: 'daily', label: 'Diária' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
  ] },
  { id: 'segment', label: 'Segmento de interesse', type: 'text', defaultRequired: false, suggestedFor: [ProductType.News] },
  { id: 'preferredDate', label: 'Data preferencial', type: 'text', defaultRequired: true, suggestedFor: [ProductType.Experience] },
  { id: 'peopleCount', label: 'Número de pessoas', type: 'text', defaultRequired: false, suggestedFor: [ProductType.Experience] },
];

export function getSuggestedFieldIds(type: ProductType): readonly string[] {
  return LEARN_MORE_FIELD_CATALOG.filter((f) => f.suggestedFor.includes(type)).map((f) => f.id);
}

export function ctaLabelFor(type: ProductType): string {
  return {
    [ProductType.Job]: 'Candidatar-se',
    [ProductType.Service]: 'Falar com vendas',
    [ProductType.Training]: 'Inscrever-se',
    [ProductType.News]: 'Receber novidades',
    [ProductType.Experience]: 'Reservar',
  }[type];
}
