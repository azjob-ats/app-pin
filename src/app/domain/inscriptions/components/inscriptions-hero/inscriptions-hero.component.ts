import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  input,
  viewChild,
} from '@angular/core';

export interface InscriptionsHeroStat {
  label: string;
  value: number;
}

@Component({
  selector: 'app-inscriptions-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="inscriptions-hero">
      <div class="inscriptions-hero__inner">
        <dl class="inscriptions-hero__stats" aria-label="Resumo das inscrições">
          @for (stat of stats(); track stat.label) {
            <div class="inscriptions-hero__stat">
              <dt class="inscriptions-hero__stat-value">{{ stat.value }}</dt>
              <dd class="inscriptions-hero__stat-label">{{ stat.label }}</dd>
            </div>
          }
        </dl>

        <div class="inscriptions-hero__slot" #slot>
          <ng-content></ng-content>
        </div>
      </div>
    </header>
  `,
  styleUrl: './inscriptions-hero.component.scss',
})
export class InscriptionsHeroComponent {
  readonly stats = input.required<InscriptionsHeroStat[]>();

  private readonly slotRef = viewChild<ElementRef<HTMLDivElement>>('slot');

  constructor() {
    effect((onCleanup) => {
      const track = this.slotRef()?.nativeElement;
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
          isDragging = false;
        }
      };

      track.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      track.addEventListener('click', onClickCapture, true);

      onCleanup(() => {
        track.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('click', onClickCapture, true);
      });
    });
  }
}
