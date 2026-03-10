import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardService } from '../../../../shared/services/board.service';
import { PinService } from '../../../../shared/services/pin.service';
import { Board } from '../../../../shared/interfaces/board.interface';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { InfiniteScrollComponent } from '../../../../shared/components/infinite-scroll/infinite-scroll.component';
import { FollowButtonComponent } from '../../../../shared/components/follow-button/follow-button.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MasonryGridComponent, SkeletonLoaderComponent, InfiniteScrollComponent, FollowButtonComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  readonly board = signal<Board | null>(null);
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  private page = 0;

  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private pinService = inject(PinService);

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('boardId') ?? 'board-1';
    this.boardService.getBoardById(boardId).subscribe(board => {
      this.board.set(board);
    });
    this.pinService.getBoardPins(boardId).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }

  onLoadMore(): void {
    if (this.isLoadingMore() || !this.board()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getBoardPins(this.board()!.id, this.page).subscribe(pins => {
      this.pins.update(c => [...c, ...pins]);
      this.isLoadingMore.set(false);
    });
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }
}
