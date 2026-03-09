import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class]="'btn--' + variant() + ' btn--' + size()"
      [class.btn--full]="fullWidth()"
      [class.btn--loading]="loading()"
      [disabled]="disabled() || _internalDisabled() || loading()"
      [type]="type()"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <span class="btn-spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
  host: {
    '[class.btn-host--full]': 'fullWidth()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();

  readonly _internalDisabled = signal(false);

  enable(): void {
    this._internalDisabled.set(false);
  }

  disable(): void {
    this._internalDisabled.set(true);
  }

  resetToInitialState(): void {
    this._internalDisabled.set(false);
  }

  isRequired(): boolean {
    return false;
  }
}
