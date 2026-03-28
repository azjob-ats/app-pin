import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="search-bar" [class.focused]="isFocused()">
      <span class="material-symbols-rounded search-icon">search</span>
      <input
        class="search-input"
        type="text"
        [placeholder]="'search.placeholder' | translate"
        [(ngModel)]="query"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        (keydown.enter)="onSubmit()"
      />
      @if (query) {
        <button class="search-clear" (click)="clear()">
          <span class="material-symbols-rounded">close</span>
        </button>
      }
    </div>
  `,
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  readonly search = output<string>();

  query = inject(ActivatedRoute).snapshot.queryParams['q'] ?? '';
  readonly isFocused = signal(false);

  onSubmit(): void {
    if (this.query.trim()) {
      this.search.emit(this.query.trim());
    }
  }

  clear(): void {
    this.query = '';
  }
}
