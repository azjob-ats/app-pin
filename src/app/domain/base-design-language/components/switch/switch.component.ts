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

/** Switch — fiel ao baseui/switch (track + thumb; tokens toggle*; SIZE default/small). CVA. */
@Component({
  selector: 'bui-switch',
  exportAs: 'buiSwitch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="bui-switch" [attr.data-size]="size()" [attr.data-disabled]="isDisabled() ? '' : null" [attr.data-label]="labelPlacement()">
      <input type="checkbox" role="switch" class="bui-switch__input" [checked]="checked()" [disabled]="isDisabled()" (change)="onToggle($event)" />
      <span class="bui-switch__track" aria-hidden="true"><span class="bui-switch__thumb"></span></span>
      <span class="bui-switch__label"><ng-content /></span>
    </label>
  `,
  styles: `
    .bui-switch { display:inline-flex; align-items:center; gap:var(--bw-sizing-scale400); cursor:pointer; }
    .bui-switch[data-label="left"] { flex-direction:row-reverse; }
    .bui-switch[data-disabled] { cursor:not-allowed; opacity:var(--bw-opacity-disabled); }
    .bui-switch__input { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; margin:0; }
    .bui-switch__track {
      display:inline-flex; align-items:center; box-sizing:border-box; padding:2px;
      width:32px; height:20px; flex-shrink:0; border-radius:999px;
      background:var(--bw-background-tertiary);
      transition: background-color var(--bw-timing-200) var(--bw-ease-out);
    }
    .bui-switch[data-size="small"] .bui-switch__track { width:28px; height:16px; }
    .bui-switch__thumb {
      width:16px; height:16px; border-radius:50%; background:var(--bw-background-primary);
      box-shadow:var(--bw-shadow-400);
      transition: transform var(--bw-timing-200) var(--bw-ease-out);
    }
    .bui-switch[data-size="small"] .bui-switch__thumb { width:12px; height:12px; }
    .bui-switch__input:checked + .bui-switch__track { background:var(--bw-content-primary); }
    .bui-switch__input:checked + .bui-switch__track .bui-switch__thumb { transform:translateX(12px); }
    .bui-switch[data-size="small"] .bui-switch__input:checked + .bui-switch__track .bui-switch__thumb { transform:translateX(12px); }
    .bui-switch__input:focus-visible + .bui-switch__track { outline:3px solid var(--bw-border-accent); outline-offset:2px; }
    .bui-switch[data-disabled] .bui-switch__track { background:var(--bw-background-state-disabled); }
    .bui-switch__label { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); &:empty { display:none; } }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Switch), multi: true }],
  host: { class: 'bui-switch-host' },
})
export class Switch implements ControlValueAccessor {
  readonly disabled = input(false);
  readonly size = input<'default' | 'small'>('default');
  readonly labelPlacement = input<'left' | 'right'>('right');

  protected readonly checked = signal(false);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: boolean | null): void { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.cvaDisabled.set(d); }
  protected onToggle(e: Event): void {
    const next = (e.target as HTMLInputElement).checked;
    this.checked.set(next); this.onChange(next); this.onTouched();
  }
}

@Component({
  selector: 'bui-s-switch', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Switch, FormsModule],
  template: `<div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
    <bui-switch [ngModel]="true">On</bui-switch>
    <bui-switch [ngModel]="false">Off</bui-switch>
    <bui-switch [ngModel]="true" size="small">Small</bui-switch>
    <bui-switch [ngModel]="true" [disabled]="true">Disabled</bui-switch>
  </div>`,
})
export class SwitchScenario {}
