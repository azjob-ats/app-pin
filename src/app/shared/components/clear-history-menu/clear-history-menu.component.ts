import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

interface HistoryCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  count: number;
  selected: boolean;
}

type ClearStatus = 'idle' | 'clearing' | 'cleared';

@Component({
  selector: 'app-clear-history-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  styleUrl: './clear-history-menu.component.scss',
  template: `
    <div class="clear-history">

      <header class="clear-history__hero">
        <span class="material-symbols-rounded clear-history__hero-icon" aria-hidden="true">history</span>
        <h1 class="clear-history__hero-title">Limpar histórico</h1>
        <p class="clear-history__hero-description">
          Apague registros de visualizações, candidaturas ou buscas feitas
          na plataforma. Esta ação não pode ser desfeita.
        </p>
      </header>

      @if (clearStatus() === 'cleared') {
        <div class="clear-history__success" role="alert">
          <span class="material-symbols-rounded clear-history__success-icon" aria-hidden="true">check_circle</span>
          <strong class="clear-history__success-title">Histórico apagado!</strong>
          <p class="clear-history__success-text">
            Os registros selecionados foram removidos permanentemente.
          </p>
          <app-button variant="outline" (clicked)="reset()">Voltar</app-button>
        </div>
      } @else {

        <section class="clear-history__section" aria-labelledby="categories-heading">
          <h2 id="categories-heading" class="clear-history__section-title">Selecione o que apagar</h2>
          <ul class="clear-history__list" role="list">
            @for (cat of categories(); track cat.id) {
              <li
                class="clear-history__item"
                [class.clear-history__item--selected]="cat.selected"
              >
                <button
                  type="button"
                  class="clear-history__item-btn"
                  [attr.aria-pressed]="cat.selected"
                  (click)="toggle(cat.id)"
                >
                  <span class="material-symbols-rounded clear-history__item-icon" aria-hidden="true">{{ cat.icon }}</span>
                  <div class="clear-history__item-body">
                    <strong class="clear-history__item-title">{{ cat.title }}</strong>
                    <span class="clear-history__item-description">{{ cat.description }}</span>
                  </div>
                  <div class="clear-history__item-right">
                    <span class="clear-history__item-count">{{ cat.count }} registros</span>
                    <span
                      class="clear-history__item-check"
                      [class.clear-history__item-check--on]="cat.selected"
                      aria-hidden="true"
                    >
                      <span class="material-symbols-rounded">
                        {{ cat.selected ? 'check_box' : 'check_box_outline_blank' }}
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            }
          </ul>
        </section>

        <section class="clear-history__section" aria-labelledby="period-heading">
          <h2 id="period-heading" class="clear-history__section-title">Período</h2>
          <ul class="clear-history__periods" role="list">
            @for (period of periods; track period.value) {
              <li>
                <button
                  type="button"
                  class="clear-history__period-btn"
                  [class.clear-history__period-btn--active]="selectedPeriod() === period.value"
                  [attr.aria-pressed]="selectedPeriod() === period.value"
                  (click)="selectPeriod(period.value)"
                >
                  {{ period.label }}
                </button>
              </li>
            }
          </ul>
        </section>

        @if (noneSelected()) {
          <p class="clear-history__hint" role="status">
            Selecione ao menos uma categoria para continuar.
          </p>
        }

        <div class="clear-history__warning">
          <span class="material-symbols-rounded clear-history__warning-icon" aria-hidden="true">warning</span>
          <p class="clear-history__warning-text">
            Esta ação é <strong>permanente e irreversível</strong>. Os dados apagados não poderão ser recuperados.
          </p>
        </div>

        <app-button
          variant="primary"
          [fullWidth]="true"
          icon="delete_sweep"
          [loading]="clearStatus() === 'clearing'"
          [disabled]="noneSelected()"
          (clicked)="clear()"
        >
          Limpar histórico selecionado
        </app-button>

      }

    </div>
  `,
})
export class ClearHistoryMenuComponent {
  readonly periods = [
    { value: 'last_hour', label: 'Última hora' },
    { value: 'today', label: 'Hoje' },
    { value: 'last_week', label: 'Última semana' },
    { value: 'last_month', label: 'Último mês' },
    { value: 'all_time', label: 'Todo o histórico' },
  ];

  readonly categories = signal<HistoryCategory[]>([
    { id: 'searches', icon: 'search', title: 'Buscas realizadas', description: 'Termos que você pesquisou na plataforma.', count: 142, selected: false },
    { id: 'views', icon: 'visibility', title: 'Conteúdos visualizados', description: 'Pins e vídeos que você assistiu ou abriu.', count: 891, selected: false },
    { id: 'applications', icon: 'work', title: 'Candidaturas', description: 'Registro de vagas às quais você se candidatou.', count: 17, selected: false },
    { id: 'profile_visits', icon: 'account_circle', title: 'Perfis visitados', description: 'Histórico de perfis de usuários e empresas que você acessou.', count: 204, selected: false },
    { id: 'interactions', icon: 'favorite', title: 'Interações', description: 'Curtidas, reações e comentários feitos.', count: 336, selected: false },
  ]);

  readonly selectedPeriod = signal('all_time');
  readonly clearStatus = signal<ClearStatus>('idle');

  readonly noneSelected = () => this.categories().every((c) => !c.selected);

  toggle(id: string): void {
    this.categories.update((cats) =>
      cats.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  }

  selectPeriod(value: string): void {
    this.selectedPeriod.set(value);
  }

  clear(): void {
    if (this.noneSelected()) return;
    this.clearStatus.set('clearing');
    setTimeout(() => {
      this.categories.update((cats) =>
        cats.map((c) => (c.selected ? { ...c, count: 0, selected: false } : c)),
      );
      this.clearStatus.set('cleared');
    }, 1200);
  }

  reset(): void {
    this.clearStatus.set('idle');
  }
}
