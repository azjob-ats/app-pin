import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { ContentCategory } from '@shared/interfaces/entity/content-category';

@Component({
  selector: 'home-dynamic-interest-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipScrollComponent],
  templateUrl: './dynamic-interest-tabs.component.html',
  styleUrl: './dynamic-interest-tabs.component.scss',
})
export class DynamicInterestTabsComponent {
  readonly tabs = input<ContentCategory[]>([]);
  readonly selectedTab = input<string>('all');
  readonly isLoading = input(false);
  readonly tabSelect = output<string>();

  readonly chips = computed(() =>
    this.tabs().map((cat) => ({ key: cat.key, icon: cat.icon ?? undefined, labelKey: '' + cat.key })),
  );

  readonly skeletonWidths = [56, 80, 120, 96, 104, 72, 136, 88, 64, 112];
}
