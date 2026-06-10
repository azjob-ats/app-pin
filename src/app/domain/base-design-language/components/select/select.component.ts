import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BuiTag } from '../tag/tag.component';
import { BuiSearch, BuiDeleteAlt } from '../icon/icon.component';

/** Opção crua: objeto livre (lido via labelKey/valueKey). */
export interface Option {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
  disabled?: boolean;
  href?: string;
}

export type SelectSize = 'mini' | 'compact' | 'default' | 'large';
export type SelectType = 'select' | 'search';
/** Lista plana de opções **ou** grupos (`{ Grupo: Option[] }`). */
export type SelectOptions = Option[] | Record<string, Option[]>;

interface Row {
  kind: 'header' | 'option' | 'create' | 'empty';
  label: string;
  option?: Option;
}

/**
 * Select — clone fiel do `baseui/select` (controle + dropdown estilo Menu). Cobre
 * single/multi, `type=search` (campo de busca filtrável), `creatable`, `isLoading`,
 * `clearable`, grupos, `value` controlado, sizes e states (error/positive/disabled).
 *
 * Mantém o **contrato single-value (CVA string)** e as classes `__control`/`__value`/
 * `__arrow` usadas pela **Pagination** (✅): quando `!searchable && !multi && type=select`
 * o controle continua sendo um `<button>` idêntico ao anterior.
 */
@Component({
  selector: 'bui-select',
  exportAs: 'buiSelect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTag, BuiSearch, BuiDeleteAlt],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  host: {
    'data-baseweb': 'select',
    class: 'bui-select-host',
    '[class]': 'hostClasses()',
    '[attr.dir]': 'dir() || null',
  },
})
export class Select implements ControlValueAccessor {
  readonly options = input<SelectOptions>([]);
  readonly labelKey = input<string>('label');
  readonly valueKey = input<string>('id');
  readonly placeholder = input<string>('Select…');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<SelectSize>('default');
  readonly type = input<SelectType>('select');
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly multi = input(false, { transform: booleanAttribute });
  readonly creatable = input(false, { transform: booleanAttribute });
  readonly isLoading = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly startOpen = input(false, { transform: booleanAttribute });
  readonly closeOnSelect = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>('');
  readonly dir = input<string>('');
  /** `searchable` default = `type===search` (campo digitável). */
  readonly searchable = input<boolean | undefined>(undefined);
  /** Valor controlado inicial — array de opções (casadas por valueKey). */
  readonly value = input<Option[] | undefined>(undefined);

  readonly changed = output<Option[]>();
  readonly inputChange = output<string>();
  readonly blurred = output<void>();

  private readonly _nativeInput = viewChild<ElementRef<HTMLInputElement>>('nativeInput');
  private readonly _controlBtn = viewChild<ElementRef<HTMLButtonElement>>('controlBtn');

  // ── estado interno ──
  protected readonly open = signal(false);
  protected readonly focused = signal(false);
  protected readonly inputValue = signal('');
  protected readonly selectedOptions = signal<Option[]>([]);
  protected readonly highlighted = signal(0);

  constructor() {
    // inputs só estão resolvidos dentro de effect() — semeia valor/startOpen/autoFocus reativo.
    effect(() => {
      const v = this.value();
      if (v !== undefined) this.selectedOptions.set(this.resolve(v));
    });
    effect(() => {
      if (this.startOpen()) this.open.set(true);
    });
    effect(() => {
      if (this.autoFocus()) this.focused.set(true);
    });
  }

  // ── derivados ──
  protected readonly isSearch = computed(() => this.type() === 'search');
  protected readonly isSearchable = computed(() => this.searchable() ?? this.isSearch());
  /** Controle vira `<div>` (input/tags) quando busca/multi; senão `<button>` (Pagination). */
  protected readonly rich = computed(() => this.isSearchable() || this.multi() || this.isSearch());

  protected readonly isEmpty = computed(() => this.selectedOptions().length === 0);
  protected readonly singleLabel = computed(() => {
    const o = this.selectedOptions()[0];
    return o ? String(o[this.labelKey()]) : '';
  });
  protected readonly showClear = computed(
    () => this.clearable() && !this.isEmpty() && !this.disabled(),
  );

  protected readonly hostClasses = computed(() =>
    [
      'bui-select-host',
      `bui-select--${this.size()}`,
      this.error() ? 'bui-select--error' : '',
      this.positive() ? 'bui-select--positive' : '',
      this.disabled() ? 'bui-select--disabled' : '',
      this.focused() || this.open() ? 'bui-select--focused' : '',
      this.isSearch() ? 'bui-select--search' : '',
      this.multi() ? 'bui-select--multi' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly tagSize = computed<'small' | 'medium' | 'large'>(() => {
    const s = this.size();
    return s === 'large' ? 'medium' : s === 'mini' ? 'small' : 'small';
  });

  /** Linhas do dropdown: grupos + filtro de busca + "Create …". */
  protected readonly rows = computed<Row[]>(() => {
    const lk = this.labelKey();
    const q = this.inputValue().toLowerCase();
    const groups = this.normalize();
    const taken = new Set(this.selectedOptions().map((o) => o[this.valueKey()]));
    const out: Row[] = [];
    for (const [name, opts] of groups) {
      const visible = opts.filter((o) => {
        if (this.multi() && taken.has(o[this.valueKey()])) return false;
        return !q || String(o[lk]).toLowerCase().includes(q);
      });
      if (!visible.length) continue;
      if (name) out.push({ kind: 'header', label: name });
      for (const o of visible) out.push({ kind: 'option', label: String(o[lk]), option: o });
    }
    if (this.creatable() && q) {
      const exists = out.some((r) => r.option && String(r.option[lk]).toLowerCase() === q);
      if (!exists) out.push({ kind: 'create', label: this.inputValue() });
    }
    if (!out.length) out.push({ kind: 'empty', label: 'No results found' });
    return out;
  });

  // ── ações ──
  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
    if (this.open()) this.highlighted.set(0);
  }

  protected openMenu(): void {
    if (this.disabled() || this.open()) return;
    this.open.set(true);
    this.highlighted.set(0);
  }

  protected onInput(ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    this.inputValue.set(v);
    this.open.set(true);
    this.highlighted.set(0);
    this.inputChange.emit(v);
  }

  protected pickRow(row: Row): void {
    if (row.kind === 'header' || row.kind === 'empty') return;
    const opt: Option =
      row.kind === 'create'
        ? { [this.valueKey()]: row.label, [this.labelKey()]: row.label }
        : (row.option as Option);
    if (opt.disabled) return;
    this.select(opt);
  }

  private select(opt: Option): void {
    if (this.multi()) {
      this.selectedOptions.update((cur) => [...cur, opt]);
    } else {
      this.selectedOptions.set([opt]);
    }
    this.inputValue.set('');
    this.onChange(String(opt[this.valueKey()]));
    this.onTouched();
    this.changed.emit(this.selectedOptions());
    if (this.closeOnSelect() && !this.multi()) this.open.set(false);
  }

  protected removeTag(opt: Option, ev?: Event): void {
    ev?.stopPropagation();
    const vk = this.valueKey();
    this.selectedOptions.update((cur) => cur.filter((o) => o[vk] !== opt[vk]));
    this.changed.emit(this.selectedOptions());
  }

  protected clearAll(ev: Event): void {
    ev.stopPropagation();
    this.selectedOptions.set([]);
    this.inputValue.set('');
    this.onChange('');
    this.changed.emit([]);
  }

  protected closeMenu(): void {
    this.open.set(false);
    this.inputValue.set('');
  }

  protected isHighlighted(i: number, row: Row): boolean {
    return row.kind === 'option' && this.highlighted() === i;
  }

  protected isSelected(row: Row): boolean {
    if (!row.option) return false;
    const vk = this.valueKey();
    return this.selectedOptions().some((o) => o[vk] === row.option![vk]);
  }

  // ── helpers ──
  private normalize(): Array<[string, Option[]]> {
    const opts = this.options();
    if (Array.isArray(opts)) return [['', opts]];
    return Object.entries(opts).map(([k, v]) => [k === '__ungrouped' ? '' : k, v]);
  }

  private flat(): Option[] {
    return this.normalize().flatMap(([, v]) => v);
  }

  /** Casa valores parciais (ex.: `[{color:'#00FFFF'}]`) com as opções reais. */
  private resolve(partials: Option[]): Option[] {
    const vk = this.valueKey();
    const all = this.flat();
    return partials.map((p) => all.find((o) => o[vk] === p[vk]) ?? p);
  }

  // ── CVA (single-value string — Pagination/ngModel) ──
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void {
    if (v == null || v === '') {
      this.selectedOptions.set([]);
      return;
    }
    const vk = this.valueKey();
    const match = this.flat().find((o) => String(o[vk]) === String(v));
    this.selectedOptions.set(match ? [match] : []);
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(): void {
    /* via input */
  }

  // ── public API (control-ref / input-ref equivalents) ──
  setDropdownOpen(open: boolean): void {
    this.open.set(open);
    if (open) this.highlighted.set(0);
  }

  setInputValue(value: string): void {
    this.inputValue.set(value);
    if (value) this.open.set(true);
  }

  focus(): void {
    this._nativeInput()?.nativeElement.focus();
    this._controlBtn()?.nativeElement.focus();
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.blurred.emit();
  }
}
