import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Board } from '../../interfaces/board.interface';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <a class="board-card" [routerLink]="['/' + board().owner.username + '/boards/' + board().id]">
      <div class="board-cover">
        @if (board().coverImages?.length) {
          <div class="board-cover-grid">
            <img [src]="board().coverImages![0]" [alt]="board().name" class="cover-main" loading="lazy" />
            <div class="cover-side">
              @if (board().coverImages![1]) {
                <img [src]="board().coverImages![1]" [alt]="board().name" class="cover-sm" loading="lazy" />
              }
              @if (board().coverImages![2]) {
                <img [src]="board().coverImages![2]" [alt]="board().name" class="cover-sm" loading="lazy" />
              }
            </div>
          </div>
        } @else if (board().coverImageUrl) {
          <img [src]="board().coverImageUrl" [alt]="board().name" class="cover-single" loading="lazy" />
        } @else {
          <div class="cover-placeholder">
            <span class="material-symbols-rounded">grid_view</span>
          </div>
        }
      </div>
      <div class="board-info">
        <p class="board-name">{{ board().name }}</p>
        <p class="board-count">{{ board().pinsCount }} {{ 'board.pins' | translate }}</p>
      </div>
    </a>
  `,
  styleUrl: './board-card.component.scss',
})
export class BoardCardComponent {
  readonly board = input.required<Board>();
}
