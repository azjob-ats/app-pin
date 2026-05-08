import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';

export interface Inscription {
  id: string;
  type: InscriptionType;
  status: InscriptionStatus;
  title: string;
  pinId: string;
  pinThumbnailUrl: string;
  creator: InscriptionParty;
  company: InscriptionParty;
  submittedAt: Date;
  updatedAt: Date;
  nextStep: string | null;
  externalUrl: string | null;
  cancellable: boolean;
}

export interface InscriptionParty {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
}
