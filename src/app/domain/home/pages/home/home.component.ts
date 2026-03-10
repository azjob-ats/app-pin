import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PinService } from '../../../../shared/services/pin.service';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '../../../../shared/components/infinite-scroll/infinite-scroll.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, MasonryGridComponent, SkeletonLoaderComponent, InfiniteScrollComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  private page = 0;

  constructor(private pinService: PinService) {}

  ngOnInit(): void {
    this.loadPins();
  }

  loadPins(): void {
    this.isLoading.set(true);
    this.pinService.getPins(this.page).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getPins(this.page).subscribe(pins => {
      this.pins.update(current => [...current, ...pins]);
      this.isLoadingMore.set(false);
    });
  }
}
