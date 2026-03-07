import { Component, output, OnInit, OnDestroy, ElementRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-infinite-scroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-sentinel" #sentinel>
      @if (loading()) {
        <div class="scroll-spinner">
          <div class="spinner"></div>
        </div>
      }
    </div>
  `,
  styleUrl: './infinite-scroll.component.scss',
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  readonly loadMore = output<void>();
  readonly loading = input(false);
  readonly threshold = input(0.1);

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !this.loading()) {
          this.loadMore.emit();
        }
      },
      { threshold: this.threshold() }
    );
    const sentinel = this.el.nativeElement.querySelector('.scroll-sentinel');
    if (sentinel) this.observer.observe(sentinel);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
