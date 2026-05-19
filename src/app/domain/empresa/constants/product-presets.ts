import { ProductPhase } from '@shared/enums/product-phase.enum';
import { ProductType } from '@shared/enums/product-type.enum';

export interface ProductTypeMeta {
  readonly label: string;
  readonly icon: string;
  readonly color: string;
}

export interface ProductPhaseMeta {
  readonly label: string;
  readonly color: string;
  readonly description: string;
}

export const PRODUCT_TYPE_META: Readonly<Record<ProductType, ProductTypeMeta>> = {
  [ProductType.Job]: { label: 'Vagas', icon: 'work', color: '#2563eb' },
  [ProductType.Service]: { label: 'Produtos/Serviços', icon: 'sell', color: '#0ea5e9' },
  [ProductType.Training]: { label: 'Treinamentos', icon: 'school', color: '#a855f7' },
  [ProductType.News]: { label: 'Notícias', icon: 'campaign', color: '#f59e0b' },
  [ProductType.Experience]: { label: 'Experiências', icon: 'event', color: '#10b981' },
};

export const PRODUCT_PHASE_META: Readonly<Record<ProductPhase, ProductPhaseMeta>> = {
  [ProductPhase.Backlog]: {
    label: 'Backlog',
    color: '#64748b',
    description: 'Em rascunho, ainda não publicado',
  },
  [ProductPhase.InCampaign]: {
    label: 'Em campanha',
    color: '#2563eb',
    description: 'Visível no canal e na busca',
  },
  [ProductPhase.Paused]: {
    label: 'Pausada',
    color: '#f59e0b',
    description: 'Oculta temporariamente',
  },
  [ProductPhase.Closed]: {
    label: 'Encerrada',
    color: '#dc2626',
    description: 'Finalizada e removida do público',
  },
};

export const DEFAULT_PRODUCT_PHASE_ORDER: readonly ProductPhase[] = [
  ProductPhase.Backlog,
  ProductPhase.InCampaign,
  ProductPhase.Paused,
  ProductPhase.Closed,
];

export const PRODUCT_TYPES_IN_ORDER: readonly ProductType[] = [
  ProductType.Job,
  ProductType.Service,
  ProductType.Training,
  ProductType.News,
  ProductType.Experience,
];
