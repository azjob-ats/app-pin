import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollectionBundle, CollectionItem } from '@shared/interfaces/entity/collection-bundle';

@Component({
  selector: 'app-collection-bundle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './collection-bundle.component.html',
  styleUrl: './collection-bundle.component.scss',
})
export class CollectionBundleComponent {
  readonly bundle = input.required<CollectionBundle>();

  readonly coverImages = computed<string[]>(() => {
    const b = this.bundle();
    if (b.coverUrl) return [b.coverUrl];
    return b.items
      .filter((i): i is CollectionItem & { thumbnailUrl: string } => !!i.thumbnailUrl)
      .slice(0, 3)
      .map((i) => i.thumbnailUrl);
  });

  readonly hasImages = computed(() => this.coverImages().length > 0);

  readonly typeIcon: Record<CollectionItem['type'], string> = {
    image: 'image',
    video: 'play_circle',
    audio: 'headphones',
    app: 'apps',
  };
}
