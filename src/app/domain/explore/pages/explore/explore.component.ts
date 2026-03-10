import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PinService } from '../../../../shared/services/pin.service';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '../../../../shared/components/infinite-scroll/infinite-scroll.component';

interface Category {
  key: string;
  icon: string;
  imageUrl: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MasonryGridComponent, SkeletonLoaderComponent, InfiniteScrollComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly selectedCategory = signal<string>('all');
  private page = 0;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pinService = inject(PinService);

  readonly categories: Category[] = [
    { key: 'all', icon: 'apps', imageUrl: 'https://picsum.photos/seed/cat-all/300/200' },
    { key: 'fashion', icon: 'styler', imageUrl: 'https://picsum.photos/seed/cat-fashion/300/200' },
    { key: 'food', icon: 'restaurant', imageUrl: 'https://picsum.photos/seed/cat-food/300/200' },
    { key: 'travel', icon: 'flight', imageUrl: 'https://picsum.photos/seed/cat-travel/300/200' },
    { key: 'home', icon: 'home', imageUrl: 'https://picsum.photos/seed/cat-home/300/200' },
    { key: 'beauty', icon: 'spa', imageUrl: 'https://picsum.photos/seed/cat-beauty/300/200' },
    { key: 'art', icon: 'palette', imageUrl: 'https://picsum.photos/seed/cat-art/300/200' },
    { key: 'design', icon: 'design_services', imageUrl: 'https://picsum.photos/seed/cat-design/300/200' },
    { key: 'nature', icon: 'park', imageUrl: 'https://picsum.photos/seed/cat-nature/300/200' },
    { key: 'architecture', icon: 'apartment', imageUrl: 'https://picsum.photos/seed/cat-arch/300/200' },
    { key: 'photography', icon: 'photo_camera', imageUrl: 'https://picsum.photos/seed/cat-photo/300/200' },
    { key: 'tech', icon: 'computer', imageUrl: 'https://picsum.photos/seed/cat-tech/300/200' },
    { key: 'fitness', icon: 'fitness_center', imageUrl: 'https://picsum.photos/seed/cat-fit/300/200' },
    { key: 'diy', icon: 'build', imageUrl: 'https://picsum.photos/seed/cat-diy/300/200' },
    { key: 'quotes', icon: 'format_quote', imageUrl: 'https://picsum.photos/seed/cat-quotes/300/200' },
  ];

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category') ?? 'all';
    this.selectedCategory.set(category);
    this.loadPins();
  }

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
    this.page = 0;
    this.pins.set([]);
    this.isLoading.set(true);
    if (key !== 'all') {
      this.router.navigate(['/explore', key]);
    } else {
      this.router.navigate(['/explore']);
    }
    this.loadPins();
  }

  private loadPins(): void {
    this.pinService.getExplorePins(this.selectedCategory()).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getExplorePins(this.selectedCategory()).subscribe(pins => {
      this.pins.update(c => [...c, ...pins]);
      this.isLoadingMore.set(false);
    });
  }
}
