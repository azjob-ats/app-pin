import { Component, input, HostListener, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-grid" [class]="'cols-' + columnCount()">
      @for (item of skeletonArray(); track $index) {
        <div class="skeleton-card" [style.height.px]="item.height"></div>
      }
    </div>
  `,
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent implements OnInit {
  readonly count = input(20);
  readonly columnCount = signal(4);

  skeletonArray: any;

  ngOnInit(): void {
    this.updateColumns();
    this.skeletonArray = signal(
      Array.from({ length: this.count() }, (_, i) => ({
        height: 150 + Math.floor(Math.sin(i * 1.7) * 100 + Math.random() * 150),
      })),
    );
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateColumns();
  }

  private updateColumns(): void {
    const w = window.innerWidth;
    if (w < 480) this.columnCount.set(2);
    else if (w < 768) this.columnCount.set(3);
    else if (w < 1024) this.columnCount.set(4);
    else if (w < 1440) this.columnCount.set(5);
    else this.columnCount.set(6);
  }
}
