import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sidebar-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar-bottom d-flex flex-col align-center gap-1">
      <ng-content />
    </div>
  `,
  styleUrl: './sidebar-footer.component.scss',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SidebarFooterComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean {
    return false;
  }
}
