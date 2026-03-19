import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-topbar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="topbar-group d-flex align-center gap-sm flex-shrink-0">
      <ng-content />
    </div>
  `,
  styleUrl: './topbar-group.component.scss',
  styles: [`
    :host {
      display: contents;
    }
  `],
})
export class TopbarGroupComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
