import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toggle-check.component.scss',
  template: `
    <button
      class="toggle-check"
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      [class.toggle-check--on]="checked()"
      (click)="toggle()"
    >
      <span class="material-symbols-rounded" aria-hidden="true">
        {{ checked() ? 'check' : 'remove' }}
      </span>
    </button>
  `,
})
export class ToggleCheckComponent {
  /** The current toggled state */
  readonly checked = input.required<boolean>();
  
  /** Screen reader label for accessibility */
  readonly ariaLabel = input.required<string>();
  
  /** Visually and functionally disables the checkbox */
  readonly disabled = input<boolean>(false);

  /** Emits the new toggled state on click */
  readonly checkedChange = output<boolean>();

  toggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
