import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toggle-switch.component.scss',
  template: `
    <button
      class="toggle-switch"
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel()"
      [class.toggle-switch--on]="checked()"
      [class.toggle-switch--disabled]="disabled()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <span class="toggle-switch__thumb"></span>
    </button>
  `,
})
export class ToggleSwitchComponent {
  checked = input.required<boolean>();
  ariaLabel = input.required<string>();
  disabled = input<boolean>(false);

  checkedChange = output<boolean>();

  toggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
