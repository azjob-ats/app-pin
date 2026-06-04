import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Combobox — fiel ao baseui/combobox (input + autocomplete filtrado). CVA string. */
@Component({
  selector: 'bui-combobox',
  exportAs: 'buiCombobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-cmb">
      <input
        class="bui-cmb__input"
        type="text"
        [value]="value()"
        [placeholder]="placeholder()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (blur)="onBlur()"
      />
      @if (open() && filtered().length) {
        <ul class="bui-cmb__menu" role="listbox">
          @for (o of filtered(); track o) {
            <li class="bui-cmb__opt" (mousedown)="pick(o)">{{ o }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .bui-cmb { position:relative; }
    .bui-cmb__input { width:100%; min-height:48px; box-sizing:border-box; padding:0 var(--bw-sizing-scale600); border:none; border-radius:var(--bw-input-border-radius); background:var(--bw-background-secondary); color:var(--bw-content-primary); font:var(--bw-font-ParagraphMedium); outline:none; }
    .bui-cmb__input:focus { background:var(--bw-background-primary); box-shadow:inset 0 0 0 2px var(--bw-border-selected); }
    .bui-cmb__input::placeholder { color:var(--bw-content-tertiary); }
    .bui-cmb__menu { position:absolute; z-index:var(--bw-z-overlay); top:calc(100% + 4px); left:0; right:0; list-style:none; margin:0; padding:var(--bw-sizing-scale200); max-height:240px; overflow:auto; border-radius:var(--bw-popover-border-radius); background:var(--bw-background-primary); box-shadow:var(--bw-shadow-600); }
    .bui-cmb__opt { padding:var(--bw-sizing-scale400) var(--bw-sizing-scale500); border-radius:var(--bw-radius-200); font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); cursor:pointer; }
    .bui-cmb__opt:hover { background:var(--bw-background-secondary); }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Combobox), multi: true }],
})
export class Combobox implements ControlValueAccessor {
  readonly options = input<string[]>([]);
  readonly placeholder = input<string>('Type to search…');

  protected readonly value = signal('');
  protected readonly open = signal(false);
  protected readonly filtered = computed(() => {
    const q = this.value().toLowerCase();
    return this.options().filter((o) => o.toLowerCase().includes(q)).slice(0, 8);
  });

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
  protected onInput(e: Event): void { const v = (e.target as HTMLInputElement).value; this.value.set(v); this.onChange(v); this.open.set(true); }
  protected onBlur(): void { this.onTouched(); setTimeout(() => this.open.set(false), 120); }
  protected pick(o: string): void { this.value.set(o); this.onChange(o); this.open.set(false); }
}

@Component({
  selector: 'bui-s-combobox', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Combobox],
  template: `<div style="width:280px;"><bui-combobox [options]="['Apple','Apricot','Avocado','Banana','Blueberry','Cherry','Grape']" /></div>`,
})
export class ComboboxScenario {}
