import { Component, output, signal, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, TranslateModule],
  template: `
    <div class="search-bar" [class.focused]="isFocused()">
      <span class="material-symbols-rounded search-icon">search</span>
      <input
        class="search-input"
        type="text"
        [placeholder]="'search.placeholder' | translate"
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        (keydown.enter)="onSubmit()"
      />
      @if (query()) {
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

  private readonly router = inject(Router);

  private readonly routeQuery = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url).queryParams['q'] ?? '')
    ),
    { initialValue: this.router.parseUrl(this.router.url).queryParams['q'] ?? '' }
  );

  readonly query = signal(this.routeQuery());
  readonly isFocused = signal(false);

  constructor() {
    effect(() => {
      this.query.set(this.routeQuery());
    });
  }

  onSubmit(): void {
    if (this.query().trim()) {
      this.search.emit(this.query().trim());
    }
  }

  clear(): void {
    this.query.set('');
  }
}
