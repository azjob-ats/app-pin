import { Component, ChangeDetectionStrategy, input, output, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-like',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn-like flex align-center justify-center radius-5 bg-secondary"
      [class.btn-like--active]="isLiked()"
      type="button"
      [attr.aria-pressed]="isLiked()"
      [attr.aria-label]="isLiked() ? 'Descurtir' : 'Curtir'"
      (click)="toggle()"
    >
      <span class="material-symbols-rounded btn-like__icon">favorite</span>
      <span class="btn-like__count">{{ count() }}</span>
    </button>
  `,
  styleUrl: './button-like.component.scss',
})
export class ButtonLikeComponent implements OnInit {
  readonly liked = input(false);
  readonly count = input(0);

  readonly likedChange = output<boolean>();

  readonly isLiked = signal(false);

  ngOnInit(): void {
    this.isLiked.set(this.liked());
  }

  toggle(): void {
    this.isLiked.update((v) => !v);
    this.likedChange.emit(this.isLiked());
  }

  enable(): void {}
  disable(): void {}

  resetToInitialState(): void {
    this.isLiked.set(this.liked());
  }

  isRequired(): boolean {
    return false;
  }
}
