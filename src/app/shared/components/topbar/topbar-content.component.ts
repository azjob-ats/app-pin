import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-topbar-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="topbar-content">
      <ng-content />
    </div>
  `,
  styleUrl: './topbar-content.component.scss',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TopbarContentComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean {
    return false;
  }
}
