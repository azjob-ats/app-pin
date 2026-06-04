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

/** Textarea — fiel ao baseui/textarea (multiline; mesmos tokens/estados do Input). CVA. */
@Component({
  selector: 'bui-textarea',
  exportAs: 'buiTextarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-textarea" [attr.data-error]="error() ? '' : null" [attr.data-positive]="positive() ? '' : null" [attr.data-disabled]="isDisabled() ? '' : null">
      <textarea
        class="bui-textarea__field"
        [placeholder]="placeholder()"
        [value]="value()"
        [rows]="rows()"
        [disabled]="isDisabled()"
        [readOnly]="readOnly()"
        [attr.aria-invalid]="error() ? 'true' : null"
        [style.resize]="resize()"
        (input)="onInput($event)"
        (blur)="onBlur()"
      ></textarea>
    </div>
  `,
  styles: `
    .bui-textarea { box-sizing:border-box; width:100%; border-radius:var(--bw-input-border-radius); background:var(--bw-background-secondary); box-shadow:inset 0 0 0 2px transparent; transition: background-color var(--bw-timing-200) var(--bw-ease-out), box-shadow var(--bw-timing-200) var(--bw-ease-out); }
    .bui-textarea:hover:not([data-disabled]) { background:var(--bw-background-tertiary); }
    .bui-textarea:focus-within { background:var(--bw-background-primary); box-shadow:inset 0 0 0 2px var(--bw-border-selected); }
    .bui-textarea[data-error] { box-shadow:inset 0 0 0 2px var(--bw-border-negative); background:var(--bw-background-primary); }
    .bui-textarea[data-positive] { box-shadow:inset 0 0 0 2px var(--bw-border-positive); background:var(--bw-background-primary); }
    .bui-textarea[data-disabled] { background:var(--bw-background-state-disabled); }
    .bui-textarea__field { display:block; width:100%; padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); border:none; background:transparent; color:var(--bw-content-primary); font:var(--bw-font-ParagraphMedium); outline:none; }
    .bui-textarea__field::placeholder { color:var(--bw-content-tertiary); }
    .bui-textarea__field:disabled { color:var(--bw-content-state-disabled); cursor:not-allowed; }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Textarea), multi: true }],
  host: { class: 'bui-textarea-host', style: 'display:block' },
})
export class Textarea implements ControlValueAccessor {
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly resize = input<'none' | 'vertical' | 'both'>('vertical');
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
  protected onInput(e: Event): void { const v = (e.target as HTMLTextAreaElement).value; this.value.set(v); this.onChange(v); }
  protected onBlur(): void { this.onTouched(); }
}

@Component({
  selector: 'bui-s-textarea', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Textarea, FormsModule],
  template: `<div style="display:flex; flex-direction:column; gap:12px; width:360px;">
    <bui-textarea placeholder="Default" />
    <bui-textarea [error]="true" placeholder="Error" />
    <bui-textarea [disabled]="true" placeholder="Disabled" />
  </div>`,
})
export class TextareaScenario {}
