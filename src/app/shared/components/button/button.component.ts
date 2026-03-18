import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'secondary' | 'cta';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonShape = 'default' | 'circle';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class]="'btn--' + variant() + ' btn--' + size()"
      [class.btn--full]="fullWidth()"
      [class.btn--loading]="loading()"
      [class.btn--circle]="shape() === 'circle'"
      [disabled]="disabled() || _internalDisabled() || loading()"
      [type]="type()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <span class="btn-spinner" aria-hidden="true"></span>
      }
      @if (icon()) {
        <span class="material-symbols-rounded" aria-hidden="true">{{ icon() }}</span>
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
  readonly shape = input<ButtonShape>('default');
  readonly icon = input<string>('');
  readonly ariaLabel = input<string>('');
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
