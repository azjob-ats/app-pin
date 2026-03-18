import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-comment-submit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="comment-submit-btn flex align-center justify-center radius-circle text-color-inverse"
      type="button"
      aria-label="Enviar comentário"
      (click)="submitted.emit()"
    >
      <span class="material-symbols-rounded">send</span>
    </button>
  `,
  styleUrl: './comment-submit.component.scss',
  host: { class: 'comment-submit-host' },
})
export class CommentSubmitComponent {
  readonly submitted = output<void>();

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}

  isRequired(): boolean {
    return false;
  }
}
