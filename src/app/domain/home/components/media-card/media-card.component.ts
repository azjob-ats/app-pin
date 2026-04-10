import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PinCardPlayerShortComponent } from '@shared/components/pin-card-player-short/pin-card-player-short.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { Post } from '@shared/interfaces/entity/post';

@Component({
  selector: 'home-media-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, PinCardPlayerShortComponent, SkeletonLoaderComponent, InfiniteScrollComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
})
export class MediaCardComponent {
  readonly posts = input<Post[]>([]);
  readonly isLoading = input(false);
  readonly isLoadingMore = input(false);
  readonly selectedCategory = input<string>('all');
  readonly loadMore = output<void>();
}
