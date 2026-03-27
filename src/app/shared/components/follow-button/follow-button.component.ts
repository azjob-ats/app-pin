import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-follow-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button class="follow-btn" [class.following]="isFollowing()" (click)="toggle()">
      {{ isFollowing() ? ('profile.following_btn' | translate) : ('profile.follow' | translate) }}
    </button>
  `,
  styleUrl: './follow-button.component.scss',
})
export class FollowButtonComponent implements OnInit {
  readonly initialFollowing = input(false);
  readonly followChange = output<boolean>();

  readonly isFollowing = signal(false);

  ngOnInit(): void {
    this.isFollowing.set(this.initialFollowing());
  }

  toggle(): void {
    this.isFollowing.update((v) => !v);
    this.followChange.emit(this.isFollowing());
  }
}
