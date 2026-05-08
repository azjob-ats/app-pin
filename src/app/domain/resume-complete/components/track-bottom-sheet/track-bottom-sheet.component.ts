import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { ResumeTrackDefinition } from '@domain/resume-complete/tokens/resume-tracks.config';

@Component({
  selector: 'app-track-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (track(); as t) {
      <div class="track-sheet" role="dialog" [attr.aria-label]="t.title">
        <div class="track-sheet__backdrop" (click)="close.emit()"></div>
        <div class="track-sheet__panel" role="document">
          <header class="track-sheet__header">
            <span
              class="track-sheet__icon"
              [style.background-color]="t.color"
              aria-hidden="true"
            >
              <span class="material-symbols-rounded">{{ t.icon }}</span>
            </span>
            <div class="track-sheet__heading">
              <h2 class="track-sheet__title">{{ t.title }}</h2>
              <p class="track-sheet__subtitle">{{ t.subtitle }}</p>
            </div>
            <button
              type="button"
              class="track-sheet__close"
              (click)="close.emit()"
              aria-label="Fechar"
            >
              <span class="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
          </header>

          <div class="track-sheet__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './track-bottom-sheet.component.scss',
})
export class TrackBottomSheetComponent {
  readonly track = input<ResumeTrackDefinition | null>(null);
  readonly close = output<void>();
}
