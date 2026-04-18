import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { EffectListCardsComponent } from '@shared/components/effect-list-cards/effect-list-cards.component';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';

@Component({
  selector: 'home-daily-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EffectListCardsComponent],
  templateUrl: './daily-story.component.html',
  styleUrl: './daily-story.component.scss',
})
export class DailyStoryComponent {
  readonly stories = input<ShopWindow[]>([]);
  readonly isLoading = input(false);

  onTitleClick(postId: string): void {
    console.log('Title clicked:', postId);
  }

  readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  private readonly destroyRef = inject(DestroyRef);
  private readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('storyTrack');

  constructor() {
    afterNextRender(() => {
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
  }
}
