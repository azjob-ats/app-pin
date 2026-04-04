import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { MasonryGridComponent } from '@shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { Pin } from '@shared/interfaces/entity/pin';
import { MediaContent } from '../../interfaces/media-content';

@Component({
  selector: 'home-media-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, MasonryGridComponent, SkeletonLoaderComponent, InfiniteScrollComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  readonly mediaItems = input<MediaContent[]>([]);
  readonly isLoading = input(false);
  readonly isLoadingMore = input(false);
  readonly selectedCategory = input<string>('all');
  readonly loadMore = output<void>();

  // MediaContent is structurally identical to Pin — safe cast for MasonryGridComponent
  readonly pins = computed(() => this.mediaItems() as unknown as Pin[]);
}
