import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { TrendingTopic } from '../../interfaces/trending-topic';

@Component({
  selector: 'home-trending-topic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipScrollComponent],
  templateUrl: './trending-topic.component.html',
  styleUrl: './trending-topic.component.scss',
})
export class TrendingTopicComponent {
  readonly topics = input<TrendingTopic[]>([]);
  readonly isLoading = input(false);
  readonly topicSelect = output<string>();

  readonly chips = computed(() =>
    this.topics().map((t) => ({ key: t.term, icon: 'trending_up', labelKey: t.term })),
  );

  readonly skeletonWidths = [96, 140, 112, 160, 120, 88, 144, 104];
}
