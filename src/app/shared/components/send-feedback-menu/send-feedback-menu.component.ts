import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SelectButtonOptionComponent } from '@shared/components/select-button-option/select-button-option.component';

interface FeedbackCategory {
  value: string;
  icon: string;
  label: string;
}

interface RatingOption {
  value: number;
  icon: string;
  label: string;
}

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  { value: 'suggestion', icon: 'lightbulb', label: 'Sugestão' },
  { value: 'bug', icon: 'bug_report', label: 'Problema técnico' },
  { value: 'content', icon: 'video_library', label: 'Conteúdo' },
  { value: 'design', icon: 'palette', label: 'Design' },
  { value: 'other', icon: 'more_horiz', label: 'Outro' },
];

const RATING_OPTIONS: RatingOption[] = [
  { value: 1, icon: 'sentiment_very_dissatisfied', label: 'Muito insatisfeito' },
  { value: 2, icon: 'sentiment_dissatisfied', label: 'Insatisfeito' },
  { value: 3, icon: 'sentiment_neutral', label: 'Neutro' },
  { value: 4, icon: 'sentiment_satisfied', label: 'Satisfeito' },
  { value: 5, icon: 'sentiment_very_satisfied', label: 'Muito satisfeito' },
];

type FormStatus = 'idle' | 'submitting' | 'success';

@Component({
  selector: 'app-send-feedback-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent, SelectButtonOptionComponent],
  styleUrl: './send-feedback-menu.component.scss',
  template: `
    <div class="send-feedback">

      <header class="send-feedback__hero">
        <span class="material-symbols-rounded send-feedback__hero-icon" aria-hidden="true">comment</span>
        <h1 class="send-feedback__hero-title">Enviar Feedback</h1>
        <p class="send-feedback__hero-description">
          Compartilhe suas ideias, sugestões ou reporte problemas
          diretamente à nossa equipe de produto.
        </p>
      </header>

      @if (formStatus() === 'success') {
        <div class="send-feedback__success" role="alert">
          <span class="material-symbols-rounded send-feedback__success-icon" aria-hidden="true">mark_email_read</span>
          <strong class="send-feedback__success-title">Feedback enviado!</strong>
          <p class="send-feedback__success-text">
            Obrigado por contribuir com a melhoria da plataforma.
            Sua opinião é muito importante para nós.
          </p>
          <app-button variant="outline" (clicked)="resetForm()">Enviar novo feedback</app-button>
        </div>
      } @else {
        <form class="send-feedback__form" (ngSubmit)="onSubmit()" novalidate>

          <section class="send-feedback__section" aria-labelledby="category-heading">
            <h2 id="category-heading" class="send-feedback__section-title">Categoria</h2>
            <ul class="send-feedback__categories" role="list">
              @for (cat of feedbackCategories; track cat.value) {
                <li>
                  <button
                    type="button"
                    class="send-feedback__category-btn"
                    [class.send-feedback__category-btn--active]="selectedCategory() === cat.value"
                    [attr.aria-pressed]="selectedCategory() === cat.value"
                    (click)="selectCategory(cat.value)"
                  >
                    <span class="material-symbols-rounded send-feedback__category-icon" aria-hidden="true">{{ cat.icon }}</span>
                    {{ cat.label }}
                  </button>
                </li>
              }
            </ul>
            @if (submitted() && !selectedCategory()) {
              <p class="send-feedback__field-error" role="alert">Selecione uma categoria</p>
            }
          </section>

          <section class="send-feedback__section" aria-labelledby="rating-heading">
            <h2 id="rating-heading" class="send-feedback__section-title">Como você avalia sua experiência?</h2>
            <div class="send-feedback__rating" role="group" aria-labelledby="rating-heading">
              @for (option of ratingOptions; track option.value) {
                <app-select-button-option
                  [selected]="selectedRating() === option.value"
                  [icon]="option.icon"
                  [label]="option.label"
                  [ariaLabel]="option.label"
                  (clicked)="selectRating(option.value)"
                />
              }
            </div>
            @if (submitted() && !selectedRating()) {
              <p class="send-feedback__field-error" role="alert">Selecione uma avaliação</p>
            }
          </section>

          <section class="send-feedback__section" aria-labelledby="details-heading">
            <h2 id="details-heading" class="send-feedback__section-title">Detalhes</h2>

            <div class="send-feedback__fields">
              <app-input
                label="Título"
                placeholder="Resumo do seu feedback"
                [(ngModel)]="title"
                name="title"
                [errorMessage]="submitted() && !title ? 'Informe um título' : ''"
              />

              <div class="send-feedback__field">
                <label class="send-feedback__label" for="feedback-message">Mensagem</label>
                <textarea
                  id="feedback-message"
                  class="send-feedback__textarea"
                  [class.send-feedback__textarea--error]="submitted() && !message"
                  placeholder="Descreva sua ideia, problema ou sugestão com detalhes..."
                  [(ngModel)]="message"
                  name="message"
                  rows="5"
                ></textarea>
                @if (submitted() && !message) {
                  <p class="send-feedback__field-error" role="alert">Descreva seu feedback</p>
                }
                <span class="send-feedback__char-count" aria-live="polite">
                  {{ message.length }} caracteres
                </span>
              </div>
            </div>
          </section>

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="formStatus() === 'submitting'"
            icon="send"
          >
            Enviar feedback
          </app-button>

        </form>
      }

    </div>
  `,
})
export class SendFeedbackMenuComponent {
  readonly feedbackCategories = FEEDBACK_CATEGORIES;
  readonly ratingOptions = RATING_OPTIONS;

  title = '';
  message = '';

  readonly selectedCategory = signal('');
  readonly selectedRating = signal(0);
  readonly submitted = signal(false);
  readonly formStatus = signal<FormStatus>('idle');

  readonly isFormValid = computed(
    () => !!this.selectedCategory() && !!this.selectedRating() && !!this.title && !!this.message,
  );

  selectCategory(value: string): void {
    this.selectedCategory.set(value);
  }

  selectRating(value: number): void {
    this.selectedRating.set(value);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.isFormValid()) return;
    this.formStatus.set('submitting');
    setTimeout(() => this.formStatus.set('success'), 1200);
  }

  resetForm(): void {
    this.title = '';
    this.message = '';
    this.selectedCategory.set('');
    this.selectedRating.set(0);
    this.submitted.set(false);
    this.formStatus.set('idle');
  }
}
