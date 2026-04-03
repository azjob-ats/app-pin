import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-select-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-select-button.component.scss',
  template: `
    <button
      class="app-select-button"
      type="button"
      [attr.aria-pressed]="selected()"
      [attr.aria-label]="ariaLabel() || null"
      [class.app-select-button--selected]="selected()"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class AppSelectButtonComponent {
  readonly selected = input.required<boolean>();
  readonly ariaLabel = input<string>('');

  readonly clicked = output<void>();
}
