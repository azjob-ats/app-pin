import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar-header mb-2 p-2">
      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
})
export class SidebarHeaderComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
