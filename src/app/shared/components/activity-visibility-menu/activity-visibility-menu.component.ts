import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

type Visibility = 'public' | 'followers' | 'private';

interface VisibilityOption {
  value: Visibility;
  icon: string;
  label: string;
  description: string;
}

interface VisibilityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  visibility: Visibility;
}

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  { value: 'public', icon: 'public', label: 'Público', description: 'Qualquer pessoa pode ver' },
  { value: 'followers', icon: 'group', label: 'Seguidores', description: 'Somente quem você segue' },
  { value: 'private', icon: 'lock', label: 'Privado', description: 'Somente você' },
];

type FormStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-activity-visibility-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './activity-visibility-menu.component.scss',
  template: `
    <div class="activity-vis">

      <header class="activity-vis__hero">
        <span class="material-symbols-rounded activity-vis__hero-icon" aria-hidden="true">multimodal_hand_eye</span>
        <h1 class="activity-vis__hero-title">Visibilidade de atividades</h1>
        <p class="activity-vis__hero-description">
          Gerencie quem pode ver suas ações, como candidaturas, interações
          e atualizações no perfil.
        </p>
      </header>

      <section class="activity-vis__section" aria-labelledby="legend-heading">
        <h2 id="legend-heading" class="activity-vis__section-title">Níveis de visibilidade</h2>
        <ul class="activity-vis__legend" role="list">
          @for (opt of visibilityOptions; track opt.value) {
            <li class="activity-vis__legend-item">
              <span class="material-symbols-rounded activity-vis__legend-icon" aria-hidden="true">{{ opt.icon }}</span>
              <div>
                <strong class="activity-vis__legend-label">{{ opt.label }}</strong>
                <span class="activity-vis__legend-description">{{ opt.description }}</span>
              </div>
            </li>
          }
        </ul>
      </section>

      <section class="activity-vis__section" aria-labelledby="items-heading">
        <h2 id="items-heading" class="activity-vis__section-title">Configurar por tipo de atividade</h2>
        <ul class="activity-vis__list" role="list">
          @for (item of items(); track item.id) {
            <li class="activity-vis__item">
              <div class="activity-vis__item-info">
                <span class="material-symbols-rounded activity-vis__item-icon" aria-hidden="true">{{ item.icon }}</span>
                <div class="activity-vis__item-body">
                  <strong class="activity-vis__item-title">{{ item.title }}</strong>
                  <span class="activity-vis__item-description">{{ item.description }}</span>
                </div>
              </div>
              <div class="activity-vis__select-wrap">
                <span class="material-symbols-rounded activity-vis__select-icon" aria-hidden="true">{{ iconFor(item.visibility) }}</span>
                <select
                  class="activity-vis__select"
                  [value]="item.visibility"
                  [attr.aria-label]="'Visibilidade de ' + item.title"
                  (change)="updateVisibility(item.id, $event)"
                >
                  @for (opt of visibilityOptions; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              </div>
            </li>
          }
        </ul>
      </section>

      <div class="activity-vis__actions">
        @if (formStatus() === 'saved') {
          <span class="activity-vis__saved-badge" role="status">
            <span class="material-symbols-rounded" aria-hidden="true">check_circle</span>
            Preferências salvas
          </span>
        }
        <app-button
          variant="primary"
          [loading]="formStatus() === 'saving'"
          (clicked)="save()"
        >
          Salvar preferências
        </app-button>
      </div>

    </div>
  `,
})
export class ActivityVisibilityMenuComponent {
  readonly visibilityOptions = VISIBILITY_OPTIONS;

  readonly items = signal<VisibilityItem[]>([
    { id: 'profile_views', icon: 'visibility', title: 'Visualizações do perfil', description: 'Quem pode ver que você visitou o perfil de outra pessoa.', visibility: 'followers' },
    { id: 'applications', icon: 'work', title: 'Candidaturas', description: 'Quem pode ver as vagas às quais você se candidatou.', visibility: 'private' },
    { id: 'interactions', icon: 'favorite', title: 'Curtidas e reações', description: 'Quem pode ver os conteúdos que você curtiu ou reagiu.', visibility: 'followers' },
    { id: 'comments', icon: 'chat_bubble', title: 'Comentários', description: 'Quem pode ver os comentários que você fez em conteúdos.', visibility: 'public' },
    { id: 'saves', icon: 'bookmark', title: 'Conteúdos salvos', description: 'Quem pode ver os pins e vídeos que você salvou.', visibility: 'private' },
    { id: 'follows', icon: 'person_add', title: 'Seguindo', description: 'Quem pode ver os perfis e empresas que você segue.', visibility: 'followers' },
    { id: 'profile_updates', icon: 'edit', title: 'Atualizações do perfil', description: 'Quem recebe notificação quando você atualiza seu perfil.', visibility: 'followers' },
    { id: 'online_status', icon: 'circle', title: 'Status online', description: 'Quem pode ver quando você está ativo na plataforma.', visibility: 'followers' },
  ]);

  readonly formStatus = signal<FormStatus>('idle');

  iconFor(visibility: Visibility): string {
    return VISIBILITY_OPTIONS.find((o) => o.value === visibility)?.icon ?? 'public';
  }

  updateVisibility(id: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Visibility;
    this.items.update((list) =>
      list.map((item) => (item.id === id ? { ...item, visibility: value } : item)),
    );
    this.formStatus.set('idle');
  }

  save(): void {
    this.formStatus.set('saving');
    setTimeout(() => this.formStatus.set('saved'), 1000);
  }
}
