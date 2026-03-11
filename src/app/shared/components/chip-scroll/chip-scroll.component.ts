import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild, viewChildren } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface ChipItem {
  key: string;
  icon?: string;
  labelKey: string;
}

@Component({
  selector: 'app-chip-scroll',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chip-scroll.component.scss',
  template: `
    <div class="chip-scroll-bar">
      <div class="chip-scroll-track" #track>
        @for (chip of chips(); track chip.key) {
          <button
            #chipBtn
            class="chip"
            [class.active]="selected() === chip.key"
            (click)="chipSelect.emit(chip.key)"
          >
            @if (chip.icon) {
              <span class="material-symbols-rounded">{{ chip.icon }}</span>
            }
            <span>{{ chip.labelKey | translate }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class ChipScrollComponent {
  readonly chips = input.required<ChipItem[]>();
  readonly selected = input<string>('');
  readonly chipSelect = output<string>();

  private readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');
  private readonly chipRefs = viewChildren<ElementRef<HTMLButtonElement>>('chipBtn');

  constructor() {
    effect(() => {
      const selected = this.selected();
      const chips = this.chips();
      const refs = this.chipRefs();
      const idx = chips.findIndex(c => c.key === selected);
      if (idx !== -1 && refs[idx]) {
        refs[idx].nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    });

    effect((onCleanup) => {
      const track = this.trackRef()?.nativeElement;
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
        isDown = false;
        track.style.cursor = 'grab';
      };

      const onMouseLeave = () => {
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
          isDragging = false;
        }
      };

      track.addEventListener('mousedown', onMouseDown);
      track.addEventListener('mouseup', onMouseUp);
      track.addEventListener('mouseleave', onMouseLeave);
      track.addEventListener('mousemove', onMouseMove);
      track.addEventListener('click', onClickCapture, true);

      onCleanup(() => {
        track.removeEventListener('mousedown', onMouseDown);
        track.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('mouseleave', onMouseLeave);
        track.removeEventListener('mousemove', onMouseMove);
        track.removeEventListener('click', onClickCapture, true);
      });
    });
  }

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
