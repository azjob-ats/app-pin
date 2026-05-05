// =============================================================================
// FEATURE DESATIVADA: home-trending-topic
// Implementação comentada em 2026-05-05.
// Motivo: testes com modelos não resultaram em compatibilidade com o projeto.
// Referência da decisão: /spec/home-trending-topic/decision.md
// =============================================================================

/*
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
*/
