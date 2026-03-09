import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="divider" role="separator">
      <span class="divider__line"></span>
      @if (text()) {
        <span class="divider__text">{{ text() }}</span>
      }
      <span class="divider__line"></span>
    </div>
  `,
  styleUrl: './divider.component.scss',
})
export class DividerComponent {
  readonly text = input('');

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
