import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-select-button-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './select-button-option.component.scss',
  template: `
    <button
      class="select-button-option"
      type="button"
      [class.select-button-option--selected]="selected()"
      [attr.aria-pressed]="selected()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="clicked.emit()"
    >
      @if (icon()) {
        <span class="material-symbols-rounded select-button-option__icon" aria-hidden="true">{{ icon() }}</span>
      }
      <span class="select-button-option__label">{{ label() }}</span>
    </button>
  `,
})
export class SelectButtonOptionComponent {
  readonly selected = input.required<boolean>();
  readonly label = input.required<string>();
  readonly icon = input<string>('');
  readonly ariaLabel = input<string>('');

  readonly clicked = output<void>();
}
