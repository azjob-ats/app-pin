import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardCardComponent } from '../../../../shared/components/board-card/board-card.component';
import { ChipScrollComponent } from '../../../../shared/components/chip-scroll/chip-scroll.component';
import { InfiniteScrollComponent } from '../../../../shared/components/infinite-scroll/infinite-scroll.component';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Board } from '../../../../shared/interfaces/board.interface';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { BoardService } from '../../../../shared/services/board.service';
import { PinService } from '../../../../shared/services/pin.service';

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
    BoardCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly pins = signal<Pin[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private page = 0;
  readonly selectedCategory = signal<string>('all');
  readonly popularSearches = ['Como perder peso rápido', 'empregos ameaçados pela IA', 'idéia em um negócio online', 'Planejamento financeiro inteligente', '10 Ferramentas de IA para Negócio', 'vendendo no TIKTOK SHOP', 'prospectar clientes', 'Como se Comunicar Melhor'];
  readonly popularSearchChips = computed(() =>
    this.popularSearches.map(term => ({ key: term, icon: 'trending_up', labelKey: term }))
  );
  readonly chipItems = computed(() =>
    this.categories.map(cat => ({ key: cat.key, icon: cat.icon, labelKey: '' + cat.key }))
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

  constructor(private pinService: PinService) { }

  ngOnInit(): void {
    this.loadPins();
  }

  loadPins(): void {
    this.isLoading.set(true);
    this.pinService.getPins(this.page).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });

    this.boardService.getUserBoards('u1').subscribe(boards => this.boards.set(boards));
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
    this.pinService.getPins(this.page).subscribe(pins => {
      this.pins.update(current => [...current, ...pins]);
      this.isLoadingMore.set(false);
    });
  }

  search(q: string): void {
    this.query.set(q);
    this.page = 0;
    this.isLoading.set(true);
    this.router.navigate(['/search'], { queryParams: { q } });
    this.pinService.getSearchPins(q).subscribe(pins => {
      this.pins.set(pins);
      this.isLoading.set(false);
    });
  }
}
