import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InscriptionStatus } from '@shared/enums/inscription-status.enum';
import { InscriptionType } from '@shared/enums/inscription-type.enum';
import { Inscription } from '@shared/interfaces/entity/inscription';

const TYPE_LABELS: Record<InscriptionType, string> = {
  [InscriptionType.Job]: 'Vaga',
  [InscriptionType.Training]: 'Treinamento',
  [InscriptionType.Product]: 'Produto',
  [InscriptionType.Event]: 'Evento',
  [InscriptionType.Scheduling]: 'Agendamento',
  [InscriptionType.Contact]: 'Contato',
};

const STATUS_LABELS: Record<InscriptionStatus, string> = {
  [InscriptionStatus.Sent]: 'Enviada',
  [InscriptionStatus.InReview]: 'Em análise',
  [InscriptionStatus.Approved]: 'Aprovada',
  [InscriptionStatus.Rejected]: 'Recusada',
  [InscriptionStatus.Cancelled]: 'Cancelada',
  [InscriptionStatus.Expired]: 'Expirada',
};

@Component({
  selector: 'app-inscription-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe],
  template: `
    <article
      class="inscription-card"
      [class.is-cancelling]="isCancelling()"
      [class.is-finalized]="isFinalized()"
    >
      <div class="inscription-card__thumb" aria-hidden="true">
        <img
          [src]="inscription().pinThumbnailUrl"
          [alt]="''"
          loading="lazy"
        />
      </div>

      <div class="inscription-card__body">
        <header class="inscription-card__header">
          <span class="inscription-card__type">{{ typeLabel() }}</span>
          <span
            class="inscription-card__status"
            [class]="'status-' + inscription().status"
          >
            {{ statusLabel() }}
          </span>
        </header>

        <h3 class="inscription-card__title">{{ inscription().title }}</h3>

        <p class="inscription-card__credit">
          <span class="inscription-card__credit-company">{{ inscription().company.displayName }}</span>
          <span class="inscription-card__credit-by">by</span>
          <span class="inscription-card__credit-creator">{{ inscription().creator.displayName }}</span>
        </p>

        @if (inscription().nextStep) {
          <p class="inscription-card__next-step">
            <span class="material-symbols-rounded icon-sm" aria-hidden="true">arrow_forward</span>
            {{ inscription().nextStep }}
          </p>
        }

        <footer class="inscription-card__footer">
          <time class="inscription-card__date" [attr.datetime]="inscription().submittedAt.toISOString()">
            Enviada em {{ inscription().submittedAt | date: 'dd MMM yyyy' }}
          </time>

          <div class="inscription-card__actions">
            @if (inscription().externalUrl) {
              <a
                class="inscription-card__action-link"
                [href]="inscription().externalUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir destino
                <span class="material-symbols-rounded icon-sm" aria-hidden="true">open_in_new</span>
              </a>
            }
            @if (inscription().cancellable) {
              <button
                type="button"
                class="inscription-card__action-cancel"
                [disabled]="isCancelling()"
                (click)="cancel.emit(inscription().id)"
              >
                @if (isCancelling()) {
                  Cancelando…
                } @else {
                  Cancelar
                }
              </button>
            }
          </div>
        </footer>
      </div>
    </article>
  `,
  styleUrl: './inscription-card.component.scss',
})
export class InscriptionCardComponent {
  readonly inscription = input.required<Inscription>();
  readonly isCancelling = input<boolean>(false);

  readonly cancel = output<string>();

  readonly typeLabel = computed(() => TYPE_LABELS[this.inscription().type]);
  readonly statusLabel = computed(() => STATUS_LABELS[this.inscription().status]);
  readonly isFinalized = computed(() => {
    const status = this.inscription().status;
    return (
      status === InscriptionStatus.Cancelled ||
      status === InscriptionStatus.Rejected ||
      status === InscriptionStatus.Expired
    );
  });
}
