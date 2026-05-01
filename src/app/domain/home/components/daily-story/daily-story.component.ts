import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { PolaroidPhotoCardComponent } from '@shared/components/polaroid-photo-card/polaroid-photo-card.component';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { ShopWindow } from '@shared/interfaces/entity/shop-window';

@Component({
  selector: 'home-daily-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PolaroidPhotoCardComponent],
  templateUrl: './daily-story.component.html',
  styleUrl: './daily-story.component.scss',
})
export class DailyStoryComponent {
  readonly stories = input<ShopWindow[]>([]);
  readonly isLoading = input(false);

  readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  readonly bundles = computed<CollectionBundle[]>(() =>
    this.stories().map((story) => ({
      id: story.id,
      channel: story.channel.profileNameOfficial,
      username: story.channel.profileNameOfficial,
      collectionName: story.channel.profileNameOfficial,
      collectionNameKey: story.id,
      channelPicture: story.channel.profilePicture,
      verified: story.channel.verified,
      description: '',
      items: story.items.map((it) => ({
        type: 'video',
        postId: it.postId,
        title: it.title,
        thumbnailUrl: it.thumbnailUrl,
        videoUrl: it.short,
      })),
    })),
  );

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
