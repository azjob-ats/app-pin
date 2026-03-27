import { Component, input, output, HostListener, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pin } from '@shared/interfaces/pin.interface';
import { PinCardComponent } from '@shared/components/pin-card/pin-card.component';

@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [CommonModule, PinCardComponent],
  template: `
    <div class="masonry-grid" [class]="'cols-' + columnCount()">
      @for (pin of pins(); track pin.id) {
        <app-pin-card
          [pin]="pin"
          (saved)="pinSaved.emit($event)"
          (shared)="pinShared.emit($event)"
        />
      }
    </div>
  `,
  styleUrl: './masonry-grid.component.scss',
})
export class MasonryGridComponent implements OnInit {
  readonly pins = input<Pin[]>([]);
  readonly pinSaved = output<Pin>();
  readonly pinShared = output<Pin>();

  readonly columnCount = signal(4);

  ngOnInit(): void {
    this.updateColumns();
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
