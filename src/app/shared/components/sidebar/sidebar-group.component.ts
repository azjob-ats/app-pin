import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-sidebar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar-group d-flex flex-col align-center gap-1">
      @if (label()) {
        <span class="sidebar-group-label">{{ label() }}</span>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './sidebar-group.component.scss',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SidebarGroupComponent {
  readonly label = input<string>('');

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean {
    return false;
  }
}
