import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input, linkedSignal } from '@angular/core';

export type TextareaSize = 'mini' | 'compact' | 'default' | 'large';
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * Textarea — clone de `baseui/textarea`. Reusa o styling do Input (getRootStyles/getInputStyles)
 * num `<textarea>`. `size`, `error`/`positive`/`disabled`, `resize` (none/both/...). Root
 * `width: fit-content` quando `resize` ativo, senão 100%. Nenhum token novo.
 */
@Component({
  selector: 'bui-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../input/input.component.scss', './textarea.component.scss'],
  template: `
    <div class="bui-input" [class]="cls()" data-baseweb="textarea" [style.width]="rootWidth()">
      <div class="bui-input__root">
        <div class="bui-input__container">
          <textarea
            class="bui-input__field bui-textarea__field"
            [value]="valueState()"
            [attr.placeholder]="placeholder() || null"
            [attr.rows]="rows()"
            [disabled]="disabled()"
            [attr.aria-invalid]="error() || null"
            [style.resize]="resize()"
            (input)="onInput($event)"
          ></textarea>
        </div>
      </div>
    </div>
  `,
  host: { style: 'display:block' },
})
export class BuiTextarea {
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly size = input<TextareaSize>('default');
  readonly resize = input<TextareaResize>('none');
  readonly rows = input<number>(3);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });

  protected readonly valueState = linkedSignal(() => this.value());
  protected readonly rootWidth = computed(() => (this.resize() !== 'none' ? 'fit-content' : '100%'));
  protected readonly cls = computed(() =>
    [
      'bui-input--' + this.size(),
      this.error() ? 'bui-input--error' : '',
      this.positive() ? 'bui-input--positive' : '',
      this.disabled() ? 'bui-input--disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onInput(e: Event): void {
    this.valueState.set((e.target as HTMLTextAreaElement).value);
  }
}
