import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

interface DataCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  selected: boolean;
}

interface DataRequest {
  id: string;
  requestedAt: string;
  status: 'processing' | 'ready' | 'expired';
  format: string;
  expiresAt?: string;
}

type FormStatus = 'idle' | 'submitting' | 'submitted';

@Component({
  selector: 'app-download-data-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './download-data-menu.component.scss',
  template: `
    <div class="download-data">

      <header class="download-data__hero">
        <span class="material-symbols-rounded download-data__hero-icon" aria-hidden="true">download</span>
        <h1 class="download-data__hero-title">Baixar seus dados</h1>
        <p class="download-data__hero-description">
          Solicite um arquivo com todas as informações armazenadas sobre sua conta.
          Você receberá um link para download em até 48 horas.
        </p>
      </header>

      <section class="download-data__section" aria-labelledby="categories-heading">
        <h2 id="categories-heading" class="download-data__section-title">Selecione os dados</h2>
        <p class="download-data__section-subtitle">
          Escolha quais categorias de dados deseja incluir no arquivo.
        </p>
        <ul class="download-data__list" role="list">
          @for (category of categories(); track category.id) {
            <li class="download-data__item">
              <div class="download-data__item-info">
                <span class="material-symbols-rounded download-data__item-icon" aria-hidden="true">{{ category.icon }}</span>
                <div class="download-data__item-body">
                  <strong class="download-data__item-title">{{ category.title }}</strong>
                  <span class="download-data__item-description">{{ category.description }}</span>
                </div>
              </div>
              <button
                class="download-data__check"
                type="button"
                role="checkbox"
                [attr.aria-checked]="category.selected"
                [attr.aria-label]="(category.selected ? 'Desmarcar' : 'Selecionar') + ' ' + category.title"
                [class.download-data__check--on]="category.selected"
                (click)="toggleCategory(category.id)"
              >
                <span class="material-symbols-rounded" aria-hidden="true">
                  {{ category.selected ? 'check_box' : 'check_box_outline_blank' }}
                </span>
              </button>
            </li>
          }
        </ul>
      </section>

      <section class="download-data__section" aria-labelledby="format-heading">
        <h2 id="format-heading" class="download-data__section-title">Formato do arquivo</h2>
        <ul class="download-data__formats" role="list">
          @for (fmt of formats; track fmt.value) {
            <li>
              <button
                type="button"
                class="download-data__format-btn"
                [class.download-data__format-btn--active]="selectedFormat() === fmt.value"
                [attr.aria-pressed]="selectedFormat() === fmt.value"
                (click)="selectFormat(fmt.value)"
              >
                <span class="material-symbols-rounded download-data__format-icon" aria-hidden="true">{{ fmt.icon }}</span>
                <div class="download-data__format-body">
                  <strong>{{ fmt.label }}</strong>
                  <span>{{ fmt.description }}</span>
                </div>
                @if (selectedFormat() === fmt.value) {
                  <span class="material-symbols-rounded download-data__format-check" aria-hidden="true">check_circle</span>
                }
              </button>
            </li>
          }
        </ul>
      </section>

      @if (formStatus() === 'submitted') {
        <div class="download-data__success" role="alert">
          <span class="material-symbols-rounded download-data__success-icon" aria-hidden="true">mark_email_read</span>
          <strong class="download-data__success-title">Solicitação enviada!</strong>
          <p class="download-data__success-text">
            Seu arquivo estará disponível em até 48 horas. Você receberá um e-mail com o link para download.
          </p>
          <app-button variant="outline" (clicked)="resetForm()">Nova solicitação</app-button>
        </div>
      } @else {
        <app-button
          variant="primary"
          [fullWidth]="true"
          icon="download"
          [loading]="formStatus() === 'submitting'"
          [disabled]="noneSelected()"
          (clicked)="submit()"
        >
          Solicitar download
        </app-button>
      }

      @if (pastRequests().length > 0) {
        <section class="download-data__section" aria-labelledby="history-heading">
          <h2 id="history-heading" class="download-data__section-title">Solicitações anteriores</h2>
          <ul class="download-data__history" role="list">
            @for (req of pastRequests(); track req.id) {
              <li class="download-data__history-item">
                <span class="material-symbols-rounded download-data__history-icon" aria-hidden="true">
                  {{ req.status === 'ready' ? 'folder_zip' : req.status === 'processing' ? 'pending' : 'folder_off' }}
                </span>
                <div class="download-data__history-body">
                  <span class="download-data__history-date">Solicitado em {{ req.requestedAt }}</span>
                  <span class="download-data__history-format">Formato: {{ req.format }}</span>
                  @if (req.status === 'ready' && req.expiresAt) {
                    <span class="download-data__history-expires">Expira em {{ req.expiresAt }}</span>
                  }
                </div>
                <span
                  class="download-data__status-badge"
                  [class.download-data__status-badge--ready]="req.status === 'ready'"
                  [class.download-data__status-badge--processing]="req.status === 'processing'"
                  [class.download-data__status-badge--expired]="req.status === 'expired'"
                >
                  {{ statusLabel(req.status) }}
                </span>
              </li>
            }
          </ul>
        </section>
      }

    </div>
  `,
})
export class DownloadDataMenuComponent {
  readonly formats = [
    { value: 'json', icon: 'data_object', label: 'JSON', description: 'Estruturado, ideal para desenvolvedores.' },
    { value: 'csv', icon: 'table', label: 'CSV', description: 'Compatível com planilhas como Excel.' },
  ];

  readonly categories = signal<DataCategory[]>([
    { id: 'profile', icon: 'account_circle', title: 'Perfil e conta', description: 'Nome, e-mail, foto, biografia e configurações da conta.', selected: true },
    { id: 'content', icon: 'video_library', title: 'Conteúdos publicados', description: 'Pins, vídeos e materiais que você criou na plataforma.', selected: true },
    { id: 'interactions', icon: 'favorite', title: 'Interações', description: 'Curtidas, comentários, menções e reações.', selected: true },
    { id: 'history', icon: 'history', title: 'Histórico de atividades', description: 'Buscas realizadas, conteúdos visualizados e navegação.', selected: false },
    { id: 'connections', icon: 'group', title: 'Conexões', description: 'Lista de seguidores, seguindo e comunidades.', selected: false },
    { id: 'notifications', icon: 'notifications', title: 'Notificações', description: 'Histórico de notificações recebidas.', selected: false },
  ]);

  readonly pastRequests = signal<DataRequest[]>([
    { id: 'r1', requestedAt: '20/03/2026', status: 'ready', format: 'JSON', expiresAt: '03/04/2026' },
    { id: 'r2', requestedAt: '01/02/2026', status: 'expired', format: 'CSV' },
  ]);

  readonly selectedFormat = signal('json');
  readonly formStatus = signal<FormStatus>('idle');

  readonly noneSelected = () => this.categories().every((c) => !c.selected);

  toggleCategory(id: string): void {
    this.categories.update((cats) =>
      cats.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  }

  selectFormat(value: string): void {
    this.selectedFormat.set(value);
  }

  submit(): void {
    if (this.noneSelected()) return;
    this.formStatus.set('submitting');
    setTimeout(() => this.formStatus.set('submitted'), 1200);
  }

  resetForm(): void {
    this.formStatus.set('idle');
    this.categories.update((cats) => cats.map((c, i) => ({ ...c, selected: i < 3 })));
    this.selectedFormat.set('json');
  }

  statusLabel(status: DataRequest['status']): string {
    const labels: Record<DataRequest['status'], string> = {
      ready: 'Disponível',
      processing: 'Processando',
      expired: 'Expirado',
    };
    return labels[status];
  }
}
