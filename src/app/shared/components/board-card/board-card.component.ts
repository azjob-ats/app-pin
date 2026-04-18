import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Board } from '@shared/interfaces/entity/board';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <a class="board-card" [routerLink]="['/' + board().owner.username + '/boards/' + board().id]">
      <div class="board-cover">
        @if (board().coverImages?.length) {
          <div class="board-cover-grid">
            <img
              [src]="board().coverImages![0]"
              [alt]="board().name"
              class="cover-main"
              loading="lazy"
            />
            <div class="cover-side">
              @if (board().coverImages![1]) {
                <img
                  [src]="board().coverImages![1]"
                  [alt]="board().name"
                  class="cover-sm"
                  loading="lazy"
                />
              }
              @if (board().coverImages![2]) {
                <img
                  [src]="board().coverImages![2]"
                  [alt]="board().name"
                  class="cover-sm"
                  loading="lazy"
                />
              }
            </div>
          </div>
        } @else if (board().coverImageUrl) {
          <img
            [src]="board().coverImageUrl"
            [alt]="board().name"
            class="cover-single"
            loading="lazy"
          />
        } @else {
          <div class="cover-placeholder">
            <span class="material-symbols-rounded">grid_view</span>
          </div>
        }
      </div>
      <div class="board-info">
        <div class="board-channel">
            <img
              class="board-channel-avatar"
              [src]="board().profilePicture"
              [alt]="board().profileName"
              loading="lazy"
            />
          
          <span class="board-channel-name">{{ board().profileName }}</span>
          @if (board().verified) {
            <span
              class="board-verified material-symbols-rounded"
              aria-label="Verified account">
              verified
            </span>
          }
        </div>
      </div>
    </a>
  `,
  styleUrl: './board-card.component.scss',
})
export class BoardCardComponent {
  readonly board = input.required<Board>();
}
