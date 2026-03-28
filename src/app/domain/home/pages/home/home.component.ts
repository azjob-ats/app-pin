import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardCardComponent } from '@shared/components/board-card/board-card.component';
import { ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { MasonryGridComponent } from '@shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { Board } from '@shared/interfaces/entity/board';
import { Pin } from '@shared/interfaces/entity/pin';
import { BoardService } from '@shared/services/board.service';
import { PinService } from '@shared/services/pin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MasonryGridComponent,
    SkeletonLoaderComponent,
    InfiniteScrollComponent,
    ChipScrollComponent,
    BoardCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private page = 0;
  readonly selectedCategory = signal<string>('all');
  readonly popularSearches = [
    'Como perder peso rápido',
    'empregos ameaçados pela IA',
    'idéia em um negócio online',
    'Planejamento financeiro inteligente',
    '10 Ferramentas de IA para Negócio',
    'vendendo no TIKTOK SHOP',
    'prospectar clientes',
    'Como se Comunicar Melhor',
  ];
  readonly popularSearchChips = computed(() =>
    this.popularSearches.map((term) => ({ key: term, icon: 'trending_up', labelKey: term })),
  );
  readonly chipItems = computed(() =>
    this.categories.map((cat) => ({ key: cat.key, icon: cat.icon, labelKey: '' + cat.key })),
  );
  readonly categories: any[] = [
    { key: 'all', icon: 'apps' },
    { key: 'Para você' },
    { key: 'Hypados' },
    { key: 'Fitness e Saúde' },
    { key: 'Educação' },
    { key: 'Tecnologia' },
    { key: 'Noticias' },
    { key: 'Inteligência artificial' },
    { key: 'Empreendedorismo' },
    { key: 'Monetizações' },
    { key: 'Ao vivo' },
    { key: 'Psicologia' },
    { key: 'Enviados recentemente' },
    { key: 'Assistidos' },
    { key: 'Cursos' },
    { key: 'Shopping' },
  ];
  readonly boards = signal<Board[]>([]);
  readonly query = signal('');

  private readonly boardsTrack = viewChild<ElementRef<HTMLDivElement>>('boardsTrack');

  constructor(private pinService: PinService) {
    afterNextRender(() => {
      const track = this.boardsTrack()?.nativeElement;
      if (!track) return;

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };
      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        track.style.cursor = 'grab';
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) isDragging = true;
        track.scrollLeft = scrollLeft - walk;
      };
      const onClickCapture = (e: Event) => {
        if (isDragging) {
          e.stopPropagation();
          e.preventDefault();
          isDragging = false;
        }
      };

      const onDragStart = (e: DragEvent) => e.preventDefault();

      track.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      track.addEventListener('click', onClickCapture, true);
      track.addEventListener('dragstart', onDragStart);

      this.destroyRef.onDestroy(() => {
        track.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('click', onClickCapture, true);
        track.removeEventListener('dragstart', onDragStart);
      });
    });

    this.loadPins();
  }

  loadPins(): void {
    this.isLoading.set(true);
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });

    this.boardService.getUserBoards('u1').subscribe((boards) => this.boards.set(boards));
  }

  selectCategory(key: string): void {
    this.selectedCategory.set(key);
    this.page = 0;
    this.pins.set([]);
    this.isLoading.set(true);
    if (key !== 'all') {
      this.router.navigate(['/home', key]);
    } else {
      this.router.navigate(['/home']);
    }
    this.loadPins();
  }

  onLoadMore(): void {
    if (this.isLoadingMore()) return;
    this.isLoadingMore.set(true);
    this.page++;
    this.pinService.getPins(this.page).subscribe((pins) => {
      this.pins.update((current) => [...current, ...pins]);
      this.isLoadingMore.set(false);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.page = 0;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.pinService.getSearchPins(q).subscribe((pins) => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }
}
