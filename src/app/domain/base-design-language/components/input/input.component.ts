import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'mini' | 'compact' | 'default' | 'large';

/** Input — fiel ao baseui/input (fill bg-secondary; foco bg-primary; states error/positive). CVA. */
@Component({
  selector: 'bui-input',
  exportAs: 'buiInput',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Input), multi: true }],
  host: { class: 'bui-input-host' },
})
export class Input implements ControlValueAccessor {
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly size = input<InputSize>('default');
  readonly error = input(false);
  readonly positive = input(false);
  readonly disabled = input(false);
  readonly readOnly = input(false);

  protected readonly value = signal('');
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
  protected onInput(e: Event): void { const v = (e.target as HTMLInputElement).value; this.value.set(v); this.onChange(v); }
  protected onBlur(): void { this.onTouched(); }
}

@Component({
  selector: 'bui-s-input', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Input, FormsModule],
  template: `<div style="display:flex; flex-direction:column; gap:12px; width:320px;">
    <bui-input placeholder="Default" />
    <bui-input size="mini" placeholder="mini" />
    <bui-input size="compact" placeholder="compact" />
    <bui-input size="large" placeholder="large" />
    <bui-input [error]="true" placeholder="error" />
    <bui-input [positive]="true" placeholder="positive" />
    <bui-input [disabled]="true" placeholder="disabled" />
  </div>`,
})
export class InputScenario {}
