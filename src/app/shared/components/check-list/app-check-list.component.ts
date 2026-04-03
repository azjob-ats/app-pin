import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-check-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-check-list.component.scss',
  template: `
    <button
      class="check-list"
      type="button"
      [attr.aria-pressed]="selected()"
      [attr.aria-label]="ariaLabel() || null"
      [class.check-list--selected]="selected()"
      (click)="clicked.emit()"
    >
      @if (icon()) {
        <span class="material-symbols-rounded check-list__icon" aria-hidden="true">{{ icon() }}</span>
      }
      <div class="check-list__body">
        <strong class="check-list__label">{{ label() }}</strong>
        @if (description()) {
          <span class="check-list__description">{{ description() }}</span>
        }
      </div>
      @if (selected()) {
        <span class="material-symbols-rounded check-list__check" aria-hidden="true">check_circle</span>
      }
    </button>
  `,
})
export class AppCheckListComponent {
  readonly selected = input.required<boolean>();
  readonly label = input.required<string>();
  readonly icon = input<string>('');
  readonly description = input<string>('');
  readonly ariaLabel = input<string>('');

  readonly clicked = output<void>();
}
