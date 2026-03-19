import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sidebar-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sidebar-nav d-flex flex-col align-center gap-xs flex-1">
      <ng-content />
    </nav>
  `,
  styleUrl: './sidebar-content.component.scss',
  styles: [`
    :host {
      display: contents;
    }
  `],
})
export class SidebarContentComponent {
  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
