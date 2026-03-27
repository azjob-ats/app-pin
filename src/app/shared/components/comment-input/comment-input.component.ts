import { Component, ChangeDetectionStrategy, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-comment-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      class="comment-input-field text-3 text-1xl-title py-3"
      type="text"
      [placeholder]="placeholder()"
      [value]="_value()"
      (input)="_onInput($event)"
      (keydown.enter)="enter.emit()"
    />
  `,
  styleUrl: './comment-input.component.scss',
  host: { class: 'comment-input-host' },
})
export class CommentInputComponent {
  readonly value = input('');
  readonly placeholder = input('');

  readonly valueChange = output<string>();
  readonly enter = output<void>();

  readonly _value = signal('');

  constructor() {
    effect(() => {
      this._value.set(this.value());
    });
  }

  _onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this._value.set(val);
    this.valueChange.emit(val);
  }

  enable(): void {}
  disable(): void {}

  resetToInitialState(): void {
    this._value.set('');
  }

  isRequired(): boolean {
    return false;
  }
}
