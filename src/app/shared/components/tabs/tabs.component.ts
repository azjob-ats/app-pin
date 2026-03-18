import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import { AppTabPanelComponent } from './tab-panel.component';
import { AppTabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs-list d-flex justify-start" role="tablist">
      <ng-content select="app-tab" />
    </div>
    <div class="w-full">
      <ng-content select="app-tab-panel" />
    </div>
  `,
  styleUrl: './tabs.component.scss',
  host: { class: 'w-full' },
})
export class AppTabsComponent {
  readonly defaultTab = input('');

  private readonly override = signal<string | null>(null);
  readonly activeTab = computed(() => this.override() ?? this.defaultTab());

  protected readonly tabs = contentChildren(AppTabComponent);
  protected readonly panels = contentChildren(AppTabPanelComponent);

  setActive(id: string): void {
    this.override.set(id);
  }

  constructor() {
    effect(() => {
      const active = this.activeTab();

      this.tabs().forEach(tab => {
        tab._setActive(active === tab.id());
        tab._onClick = () => this.setActive(tab.id());
      });

      this.panels().forEach(panel => {
        panel._setVisible(active === panel.id());
      });
    });
  }
}
