import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

interface NotificationChannel {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface NotificationTopic {
  id: string;
  icon: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

const CHANNELS: NotificationChannel[] = [
  {
    id: 'email',
    icon: 'mail',
    label: 'E-mail',
    description: 'Receba notificações no seu endereço de e-mail cadastrado.',
  },
  {
    id: 'push',
    icon: 'notifications',
    label: 'Push',
    description: 'Notificações em tempo real no navegador ou dispositivo móvel.',
  },
];

type FormStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-notification-settings-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './notification-settings-menu.component.scss',
  template: `
    <div class="notif-settings">

      <header class="notif-settings__hero">
        <span class="material-symbols-rounded notif-settings__hero-icon" aria-hidden="true">notification_settings</span>
        <h1 class="notif-settings__hero-title">Notificações</h1>
        <p class="notif-settings__hero-description">
          Escolha quais tipos de notificações deseja receber e por quais canais.
        </p>
      </header>

      <section class="notif-settings__section" aria-labelledby="channels-heading">
        <h2 id="channels-heading" class="notif-settings__section-title">Canais</h2>
        <ul class="notif-settings__list" role="list">
          @for (channel of channels; track channel.id) {
            <li class="notif-settings__item">
              <div class="notif-settings__item-info">
                <span class="material-symbols-rounded notif-settings__item-icon" aria-hidden="true">{{ channel.icon }}</span>
                <div class="notif-settings__item-body">
                  <strong class="notif-settings__item-label">{{ channel.label }}</strong>
                  <span class="notif-settings__item-description">{{ channel.description }}</span>
                </div>
              </div>
              <button
                class="notif-settings__toggle"
                type="button"
                role="switch"
                [attr.aria-checked]="channelEnabled(channel.id)"
                [attr.aria-label]="'Ativar notificações por ' + channel.label"
                [class.notif-settings__toggle--on]="channelEnabled(channel.id)"
                (click)="toggleChannel(channel.id)"
              >
                <span class="notif-settings__toggle-thumb"></span>
              </button>
            </li>
          }
        </ul>
      </section>

      <section class="notif-settings__section" aria-labelledby="topics-heading">
        <h2 id="topics-heading" class="notif-settings__section-title">Tipos de notificação</h2>
        <p class="notif-settings__section-subtitle">
          Escolha quais eventos geram notificações e por qual canal.
        </p>

        <div class="notif-settings__table-wrap">
          <table class="notif-settings__table" aria-label="Preferências por tipo de notificação">
            <thead>
              <tr>
                <th class="notif-settings__th notif-settings__th--topic" scope="col">Tipo</th>
                <th class="notif-settings__th" scope="col">
                  <span class="material-symbols-rounded" aria-hidden="true">mail</span>
                  E-mail
                </th>
                <th class="notif-settings__th" scope="col">
                  <span class="material-symbols-rounded" aria-hidden="true">notifications</span>
                  Push
                </th>
              </tr>
            </thead>
            <tbody>
              @for (topic of topics(); track topic.id) {
                <tr class="notif-settings__row">
                  <td class="notif-settings__td notif-settings__td--topic">
                    <span class="material-symbols-rounded notif-settings__topic-icon" aria-hidden="true">{{ topic.icon }}</span>
                    <div>
                      <span class="notif-settings__topic-label">{{ topic.label }}</span>
                      <span class="notif-settings__topic-description">{{ topic.description }}</span>
                    </div>
                  </td>
                  <td class="notif-settings__td">
                    <button
                      class="notif-settings__check"
                      type="button"
                      role="checkbox"
                      [attr.aria-checked]="topic.email"
                      [attr.aria-label]="'Receber ' + topic.label + ' por e-mail'"
                      [class.notif-settings__check--on]="topic.email"
                      (click)="toggleTopic(topic.id, 'email')"
                    >
                      <span class="material-symbols-rounded" aria-hidden="true">
                        {{ topic.email ? 'check' : 'remove' }}
                      </span>
                    </button>
                  </td>
                  <td class="notif-settings__td">
                    <button
                      class="notif-settings__check"
                      type="button"
                      role="checkbox"
                      [attr.aria-checked]="topic.push"
                      [attr.aria-label]="'Receber ' + topic.label + ' por push'"
                      [class.notif-settings__check--on]="topic.push"
                      (click)="toggleTopic(topic.id, 'push')"
                    >
                      <span class="material-symbols-rounded" aria-hidden="true">
                        {{ topic.push ? 'check' : 'remove' }}
                      </span>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <div class="notif-settings__actions">
        @if (formStatus() === 'saved') {
          <span class="notif-settings__saved-badge" role="status">
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
export class NotificationSettingsMenuComponent {
  readonly channels = CHANNELS;

  readonly channelState = signal<Record<string, boolean>>({ email: true, push: true });

  readonly topics = signal<NotificationTopic[]>([
    {
      id: 'new_follower',
      icon: 'person_add',
      label: 'Novo seguidor',
      description: 'Quando alguém começa a seguir você',
      email: true,
      push: true,
    },
    {
      id: 'pin_saved',
      icon: 'bookmark_added',
      label: 'Pin salvo',
      description: 'Quando alguém salva um dos seus pins',
      email: false,
      push: true,
    },
    {
      id: 'pin_comment',
      icon: 'chat_bubble',
      label: 'Comentário',
      description: 'Quando alguém comenta em um pin seu',
      email: true,
      push: true,
    },
    {
      id: 'pin_react',
      icon: 'favorite',
      label: 'Reação',
      description: 'Quando alguém reage a um dos seus pins',
      email: false,
      push: false,
    },
    {
      id: 'mention',
      icon: 'alternate_email',
      label: 'Menção',
      description: 'Quando você é mencionado em um comentário',
      email: true,
      push: true,
    },
    {
      id: 'board_follow',
      icon: 'bookmarks',
      label: 'Pasta seguida',
      description: 'Quando alguém começa a seguir uma das suas pastas',
      email: false,
      push: true,
    },
  ]);

  readonly formStatus = signal<FormStatus>('idle');

  channelEnabled(id: string): boolean {
    return this.channelState()[id] ?? false;
  }

  toggleChannel(id: string): void {
    this.channelState.update((s) => ({ ...s, [id]: !s[id] }));
    this.formStatus.set('idle');
  }

  toggleTopic(id: string, channel: 'email' | 'push'): void {
    this.topics.update((ts) =>
      ts.map((t) => (t.id === id ? { ...t, [channel]: !t[channel] } : t)),
    );
    this.formStatus.set('idle');
  }

  save(): void {
    this.formStatus.set('saving');
    setTimeout(() => {
      this.formStatus.set('saved');
    }, 1000);
  }
}
