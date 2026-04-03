import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'radio-button',
    '[class.radio-button--checked]': 'checked()',
    '[class.radio-button--disabled]': 'disabled()',
  },
  template: `
    <button
      type="button"
      class="radio-button__btn"
      [class.radio-button__btn--active]="checked()"
      [attr.aria-pressed]="checked()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled() || null"
      (click)="handleClick()"
    >
      <span
        class="radio-button__indicator"
        [class.radio-button__indicator--active]="checked()"
        aria-hidden="true"
      >
        <span class="material-symbols-rounded">
          {{ checked() ? 'radio_button_checked' : 'radio_button_unchecked' }}
        </span>
      </span>
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: block;
    }

    .radio-button__btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 0.9375rem;
      font-family: inherit;
      color: var(--pin-text);
      background: none;
      border: 1px solid var(--pin-border, rgba(0, 0, 0, 0.12));
      border-radius: 0.625rem;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s, border-color 0.15s;

      &:hover:not([disabled]) {
        background: var(--pin-surface-hover, rgba(0, 0, 0, 0.04));
      }

      &:focus-visible {
        outline: 2px solid var(--pin-primary, #e60023);
        outline-offset: 2px;
      }

      &--active {
        border-color: var(--pin-primary, #e60023);
        background: color-mix(in srgb, var(--pin-primary, #e60023) 6%, transparent);
      }

      &[disabled] {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    .radio-button__indicator {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--pin-text);
      opacity: 0.35;
      transition: color 0.15s, opacity 0.15s;

      .material-symbols-rounded {
        font-size: 1.25rem;
      }

      &--active {
        color: var(--pin-primary, #e60023);
        opacity: 1;
      }
    }
  `,
})
export class RadioButtonComponent {
  checked = input(false, { transform: booleanAttribute });
  ariaLabel = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  checkedChange = output<boolean>();

  handleClick(): void {
    if (!this.disabled()) {
      this.checkedChange.emit(!this.checked());
    }
  }
}
