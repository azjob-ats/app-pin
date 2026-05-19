import { computed, Injectable, signal } from '@angular/core';

export interface LearnMoreTarget {
  readonly slug: string;
  readonly productId: string;
  /** When provided, used as a header subtitle (e.g., product title); avoids extra fetch. */
  readonly productTitle?: string;
}

@Injectable({ providedIn: 'root' })
export class LearnMoreLauncherService {
  readonly target = signal<LearnMoreTarget | null>(null);
  readonly isOpen = computed(() => this.target() !== null);

  open(target: LearnMoreTarget): void {
    this.target.set(target);
  }

  close(): void {
    this.target.set(null);
  }
}
