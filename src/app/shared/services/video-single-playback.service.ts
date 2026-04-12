import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoSinglePlaybackService {
  /** ID of the video currently allowed to play. null = none. */
  readonly activeId = signal<string | null>(null);

  setActive(id: string): void {
    this.activeId.set(id);
  }

  clearActive(id: string): void {
    if (this.activeId() === id) {
      this.activeId.set(null);
    }
  }
}
