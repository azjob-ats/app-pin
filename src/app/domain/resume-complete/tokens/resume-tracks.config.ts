import { ResumeTrack } from '@shared/enums/resume-track.enum';

export interface ResumeTrackDefinition {
  id: ResumeTrack;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export const RESUME_TRACKS: ResumeTrackDefinition[] = [
  {
    id: ResumeTrack.Skills,
    title: 'Habilidades',
    subtitle: 'O que você sabe fazer',
    icon: 'auto_awesome',
    color: '#000',
  },
  {
    id: ResumeTrack.Experience,
    title: 'Experiência',
    subtitle: 'Onde você trabalhou',
    icon: 'work',
    color: '#000',
  },
  {
    id: ResumeTrack.Education,
    title: 'Formação',
    subtitle: 'Onde você estudou',
    icon: 'school',
    color: '#000',
  },
  {
    id: ResumeTrack.Languages,
    title: 'Idiomas',
    subtitle: 'O que você fala',
    icon: 'language',
    color: '#000',
  },
  {
    id: ResumeTrack.Certifications,
    title: 'Certificações',
    subtitle: 'Cursos e premiações',
    icon: 'workspace_premium',
    color: '#000',
  },
  {
    id: ResumeTrack.About,
    title: 'Sobre',
    subtitle: 'Sua bio profissional',
    icon: 'person',
    color: '#000',
  },
  {
    id: ResumeTrack.Contact,
    title: 'Contato',
    subtitle: 'Como te encontrar',
    icon: 'forum',
    color: '#000',
  },
  {
    id: ResumeTrack.PronounPcd,
    title: 'Pronome e PCD',
    subtitle: 'Identidade e acessibilidade',
    icon: 'badge',
    color: '#000',
  },
];

export function findTrackDefinition(id: ResumeTrack): ResumeTrackDefinition | undefined {
  return RESUME_TRACKS.find((t) => t.id === id);
}
