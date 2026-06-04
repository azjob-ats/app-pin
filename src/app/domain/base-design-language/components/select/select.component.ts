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

export interface Option { id: string; label: string; }

/** Select — fiel ao baseui/select (controle + dropdown de opções). CVA. */
@Component({
  selector: 'bui-select',
  exportAs: 'buiSelect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button type="button" class="bui-select__control" [attr.data-open]="open() ? '' : null" [disabled]="disabled()" (click)="toggle()">
      <span class="bui-select__value" [class.bui-select__value--ph]="!selected()">{{ selected()?.label || placeholder() }}</span>
      <span class="material-symbols-rounded bui-select__arrow">expand_more</span>
    </button>
    @if (open()) {
      <div class="bui-select__scrim" (click)="open.set(false)"></div>
      <ul class="bui-select__menu" role="listbox">
        @for (o of options(); track o.id) {
          <li class="bui-select__opt" role="option" [class.bui-select__opt--sel]="o.id === value()" (click)="pick(o)">{{ o.label }}</li>
        }
      </ul>
    }
  `,
  styleUrl: './select.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  host: { class: 'bui-select-host' },
})
export class Select implements ControlValueAccessor {
  readonly options = input<Option[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly disabled = input(false);

  readonly value = signal<string>('');
  protected readonly open = signal(false);
  protected readonly selected = computed(() => this.options().find((o) => o.id === this.value()));

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* via input */ }

  protected toggle(): void { this.open.update((v) => !v); }
  protected pick(o: Option): void { this.value.set(o.id); this.onChange(o.id); this.onTouched(); this.open.set(false); }
}

@Component({
  selector: 'bui-s-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Select],
  template: `<div style="width:280px;">
    <bui-select [options]="[{id:'1',label:'AliceBlue'},{id:'2',label:'Amethyst'},{id:'3',label:'AntiqueWhite'},{id:'4',label:'Aqua'}]" placeholder="Choose a color" />
  </div>`,
})
export class SelectScenario {}
