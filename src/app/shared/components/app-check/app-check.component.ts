import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-check.component.scss',
  template: `
    <button
      class="app-check"
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      [class.app-check--on]="checked()"
      [class.app-check--disabled]="disabled()"
      (click)="toggle()"
    >
      <span class="material-symbols-rounded" aria-hidden="true">
        {{ checked() ? 'check_box' : 'check_box_outline_blank' }}
      </span>
    </button>
  `,
})
export class AppCheckComponent {
  readonly checked = input.required<boolean>();
  readonly ariaLabel = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  toggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
