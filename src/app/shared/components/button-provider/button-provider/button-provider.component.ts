import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';

@Component({
  selector: 'app-button-provider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn-provider"
      type="button"
      [disabled]="_internalDisabled()"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './button-provider.component.scss',
})
export class ButtonProviderComponent {
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
