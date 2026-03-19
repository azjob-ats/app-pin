import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar d-flex align-center gap-md flex-shrink-0">
      <ng-content />
    </header>
  `,
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
