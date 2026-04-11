import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CollectionBundleComponent } from '@shared/components/collection-bundle/collection-bundle.component';
import { PinCardPlayerShortComponent } from '@shared/components/pin-card-player-short/pin-card-player-short.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { FeedItem } from '../../interfaces/feed-item';

@Component({
  selector: 'home-media-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    PinCardPlayerShortComponent,
    CollectionBundleComponent,
    SkeletonLoaderComponent,
    InfiniteScrollComponent,
  ],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  readonly feedItems = input<FeedItem[]>([]);
  readonly isLoading = input(false);
  readonly isLoadingMore = input(false);
  readonly selectedCategory = input<string>('all');
  readonly loadMore = output<void>();
  readonly openCollection = output<CollectionBundle>();
}
