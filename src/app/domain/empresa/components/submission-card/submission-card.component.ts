import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Submission } from '@shared/interfaces/entity/empresa-submission';
import { PRODUCT_TYPE_META } from '@domain/empresa/constants/product-presets';

@Component({
  selector: 'app-submission-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe],
  template: `
    <div
      class="submission-card"
      [style.--submission-accent]="typeMeta().color"
    >
      <header class="submission-card__header">
        <img
          class="submission-card__avatar"
          [src]="submission().candidate.avatarUrl"
          [alt]="'Avatar de ' + submission().candidate.name"
          width="32"
          height="32"
          loading="lazy"
        />
        <div class="submission-card__identity">
          <p class="submission-card__name">{{ submission().candidate.name }}</p>
          <p class="submission-card__context">{{ submission().candidate.contextLine }}</p>
        </div>
        <span class="submission-card__type-badge" [title]="typeMeta().label">
          <span class="material-symbols-rounded" aria-hidden="true">{{ typeMeta().icon }}</span>
        </span>
      </header>

      <p class="submission-card__product">
        <span class="material-symbols-rounded" aria-hidden="true">link</span>
        <span>{{ submission().productTitle }}</span>
      </p>

      <footer class="submission-card__footer">
        <span class="submission-card__date">
          {{ submission().createdAt | date: 'dd/MM/yyyy' }}
        </span>
        @if (submission().assignedTo) {
          <span class="submission-card__assignee">
            <span class="material-symbols-rounded" aria-hidden="true">person</span>
            atribuído
          </span>
        }
      </footer>
    </div>
  `,
  styleUrl: './submission-card.component.scss',
})
export class SubmissionCardComponent {
  readonly submission = input.required<Submission>();

  readonly typeMeta = computed(() => PRODUCT_TYPE_META[this.submission().productType]);
}
