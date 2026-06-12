import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type ComboboxSize = 'mini' | 'compact' | 'default' | 'large';

@Component({
  selector: 'bui-combobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './combobox.component.scss',
  template: `
    <div #rootEl class="bui-combobox__root">
      <div
        class="bui-input bui-combobox__input-container"
        [class.bui-combobox__input-container--mini]="size() === 'mini'"
        [class.bui-combobox__input-container--compact]="size() === 'compact'"
        [class.bui-combobox__input-container--default]="size() === 'default' || !size()"
        [class.bui-combobox__input-container--large]="size() === 'large'"
        [class.bui-combobox__input-container--disabled]="disabled()"
        [class.bui-combobox__input-container--error]="error()"
        [class.bui-combobox__input-container--positive]="positive()"
      >
        <div class="bui-input__root">
          <div class="bui-input__container">
            <input
              #inputEl
              class="bui-input__field"
              type="text"
              [id]="id() || inputId"
              [name]="id() || inputId"
              [value]="tempValue()"
              [disabled]="disabled()"
              [attr.placeholder]="placeholder()"
              autocomplete="off"
              role="combobox"
              [attr.aria-label]="ariaLabel()"
              [attr.aria-expanded]="isOpen()"
              aria-haspopup="listbox"
              [attr.aria-controls]="listboxId"
              [attr.aria-autocomplete]="autocomplete() ? 'both' : 'list'"
              [attr.aria-activedescendant]="activeDescendant()"
              (click)="onInputClick()"
              (input)="onInputChange($event)"
              (keydown)="onKeydown($event)"
              (focus)="onFocus()"
              (blur)="onBlur($event)"
            />
          </div>
          @if (clearable() && tempValue()) {
            <button
              type="button"
              class="bui-combobox__clear"
              aria-label="Clear"
              (mousedown)="onClear($event)"
            >
              <span class="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
          }
        </div>
      </div>

      @if (isOpen() && options().length) {
        <ul
          #listboxEl
          [id]="listboxId"
          class="bui-combobox__listbox"
          role="listbox"
          [attr.aria-label]="listBoxLabel() || 'Options'"
          tabindex="-1"
          (mousedown)="$event.preventDefault()"
        >
          @for (option of options(); track $index; let i = $index) {
            <li
              [id]="i === selectionIndex() ? activeDescendantId : null"
              role="option"
              class="bui-combobox__item"
              [class.bui-combobox__item--mini]="size() === 'mini'"
              [class.bui-combobox__item--compact]="size() === 'compact'"
              [class.bui-combobox__item--large]="size() === 'large'"
              [class.bui-combobox__item--selected]="i === selectionIndex()"
              [attr.aria-selected]="i === selectionIndex()"
              (mousedown)="onOptionMousedown($event, i)"
            >
              {{ mapOptionToString()(option) }}
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class BuiCombobox {
  readonly id = input<string>('');
  readonly ariaLabel = input<string>('Search');
  readonly value = input<string>('');
  readonly options = input<unknown[]>([]);
  readonly mapOptionToString = input<(o: unknown) => string>((o) => String(o));
  readonly size = input<ComboboxSize>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string>('');
  readonly autocomplete = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly listBoxLabel = input<string>('Options');

  readonly valueChange = output<string>();
  readonly optionSelect = output<unknown>();

  protected readonly inputId = `bui-combobox-input-${Math.random().toString(36).slice(2)}`;
  protected readonly selectionIndex = signal(-1);
  protected readonly tempValue = signal('');
  protected readonly isOpen = signal(false);

  protected readonly listboxId = `bui-combobox-listbox-${Math.random().toString(36).slice(2)}`;
  protected readonly activeDescendantId = `bui-combobox-desc-${Math.random().toString(36).slice(2)}`;

  protected readonly activeDescendant = computed(() =>
    this.selectionIndex() >= 0 ? this.activeDescendantId : null,
  );

  private readonly inputElRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly listboxElRef = viewChild<ElementRef<HTMLUListElement>>('listboxEl');

  ngOnChanges(): void {
    this.tempValue.set(this.value());
    this.selectionIndex.set(-1);
  }

  protected onFocus(): void {
    if (!this.isOpen() && this.options().length) {
      this.isOpen.set(true);
    }
  }

  protected onBlur(e: FocusEvent): void {
    const listbox = this.listboxElRef()?.nativeElement;
    if (listbox && e.relatedTarget && listbox.contains(e.relatedTarget as Node)) {
      return;
    }
    this.isOpen.set(false);
    this.selectionIndex.set(-1);
    this.tempValue.set(this.value());
  }

  protected onInputClick(): void {
    if (!this.isOpen() && this.options().length) {
      this.isOpen.set(true);
    }
  }

  protected onInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.isOpen.set(true);
    this.selectionIndex.set(-1);
    this.tempValue.set(input.value);
    this.valueChange.emit(input.value);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const opts = this.options();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.isOpen.set(true);
      this.selectionIndex.update((prev) => {
        const next = prev + 1;
        return next > opts.length - 1 ? -1 : next;
      });
      this._applyAutocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectionIndex.update((prev) => {
        const next = prev - 1;
        return next < -1 ? opts.length - 1 : next;
      });
      this._applyAutocomplete();
    } else if (e.key === 'Enter') {
      const idx = this.selectionIndex();
      const selected = opts[idx];
      if (selected) {
        e.preventDefault();
        const str = this.mapOptionToString()(selected);
        this.isOpen.set(false);
        this.selectionIndex.set(-1);
        this.tempValue.set(str);
        this.valueChange.emit(str);
        this.optionSelect.emit(selected);
      } else {
        this.isOpen.set(false);
      }
    } else if (e.key === 'Escape') {
      this.isOpen.set(false);
      this.selectionIndex.set(-1);
      this.tempValue.set(this.value());
    }
  }

  protected onClear(event: MouseEvent): void {
    event.preventDefault();
    this.tempValue.set('');
    this.isOpen.set(false);
    this.selectionIndex.set(-1);
    this.valueChange.emit('');
    this.inputElRef()?.nativeElement.focus();
  }

  protected onOptionMousedown(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.onOptionClick(index);
  }

  protected onOptionClick(index: number): void {
    const option = this.options()[index];
    if (option) {
      const str = this.mapOptionToString()(option);
      this.isOpen.set(false);
      this.selectionIndex.set(index);
      this.tempValue.set(str);
      this.valueChange.emit(str);
      this.optionSelect.emit(option);
      this.inputElRef()?.nativeElement.focus();
    }
  }

  private _applyAutocomplete(): void {
    if (!this.autocomplete()) return;
    const idx = this.selectionIndex();
    const opts = this.options();
    if (idx >= 0 && opts[idx]) {
      this.tempValue.set(this.mapOptionToString()(opts[idx]));
    } else {
      this.tempValue.set(this.value());
    }
  }
}
