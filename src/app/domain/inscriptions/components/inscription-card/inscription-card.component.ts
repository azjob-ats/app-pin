import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
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
      <div class="inscription-card__media">
        <img
          class="inscription-card__image"
          [src]="inscription().pinThumbnailUrl"
          alt=""
          loading="lazy"
        />
        <span
          class="inscription-card__status"
          [class]="'status-' + inscription().status"
        >
          <span class="inscription-card__status-dot" aria-hidden="true"></span>
          {{ statusLabel() }}
        </span>
      </div>

      <div class="inscription-card__body">
        <div class="inscription-card__meta">
          <span class="inscription-card__type">{{ typeLabel() }}</span>
          <span class="inscription-card__sep" aria-hidden="true">·</span>
          <time
            class="inscription-card__date"
            [attr.datetime]="inscription().submittedAt.toISOString()"
          >
            {{ inscription().submittedAt | date: 'dd MMM yyyy' }}
          </time>
        </div>

        <h3 class="inscription-card__title">{{ inscription().title }}</h3>

        <p class="inscription-card__credit">
          <span class="inscription-card__credit-company">{{ inscription().company.displayName }}</span>
          <span class="inscription-card__credit-by">by</span>
          <span class="inscription-card__credit-creator">{{ inscription().creator.displayName }}</span>
        </p>

        @if (inscription().nextStep) {
          <p class="inscription-card__next-step">
            <span class="inscription-card__next-step-arrow" aria-hidden="true">→</span>
            <span class="inscription-card__next-step-text">{{ inscription().nextStep }}</span>
          </p>
        }

        <div class="inscription-card__actions">
          @if (inscription().externalUrl) {
            <a
              class="inscription-card__action-link"
              [href]="inscription().externalUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Abrir destino</span>
              <span aria-hidden="true">↗</span>
            </a>
          } @else {
            <span class="inscription-card__action-spacer"></span>
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
