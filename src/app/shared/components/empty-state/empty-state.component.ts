import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state" role="status">
      <span class="material-symbols-rounded empty-state__icon" aria-hidden="true">{{ icon() }}</span>
      <p class="empty-state__message">{{ message() }}</p>
      @if (subtitle()) {
        <p class="empty-state__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly icon = input.required<string>();
  readonly message = input.required<string>();
  readonly subtitle = input('');

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
