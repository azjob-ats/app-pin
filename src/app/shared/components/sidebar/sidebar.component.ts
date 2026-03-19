import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="sidebar d-flex flex-col align-center flex-shrink-0"
      [class.mobile-hidden]="hidden()"
    >
      <ng-content />
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly hidden = input<boolean>(false);

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
