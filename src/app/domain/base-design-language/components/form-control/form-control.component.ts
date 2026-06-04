import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { Input } from '../input/input.component';

/** FormControl — fiel ao baseui/form-control (label, caption, error/positive, counter). */
@Component({
  selector: 'bui-form-control',
  exportAs: 'buiFormControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="bui-fc__field">
      @if (label()) {
        <span class="bui-fc__label">{{ label() }}@if (required()) {<span class="bui-fc__req" aria-hidden="true">*</span>}</span>
      }
      <span class="bui-fc__control"><ng-content /></span>
    </label>
    @if (message() || counter()) {
      <div class="bui-fc__footer">
        @if (message()) { <span class="bui-fc__msg" [attr.role]="hasError() ? 'alert' : 'status'">{{ message() }}</span> }
        @if (counter(); as c) { <span class="bui-fc__counter">{{ c.length }}{{ c.max ? '/' + c.max : '' }}</span> }
      </div>
    }
  `,
  styles: `
    bui-form-control { display:flex; flex-direction:column; gap:var(--bw-sizing-scale300); }
    .bui-fc__field { display:flex; flex-direction:column; gap:var(--bw-sizing-scale300); }
    .bui-fc__label { font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); }
    bui-form-control[data-disabled] .bui-fc__label { color:var(--bw-content-state-disabled); }
    .bui-fc__req { color:var(--bw-content-negative); margin-left:2px; }
    .bui-fc__footer { display:flex; justify-content:space-between; gap:var(--bw-sizing-scale400); }
    .bui-fc__msg { font:var(--bw-font-ParagraphXSmall); color:var(--bw-content-secondary); }
    bui-form-control[data-error] .bui-fc__msg { color:var(--bw-content-negative); }
    bui-form-control[data-positive] .bui-fc__msg { color:var(--bw-content-positive); }
    .bui-fc__counter { margin-left:auto; font:var(--bw-font-ParagraphXSmall); color:var(--bw-content-tertiary); }
  `,
  host: {
    '[attr.data-error]': 'hasError() ? "" : null',
    '[attr.data-positive]': 'positive() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class FormControl {
  readonly label = input<string>('');
  readonly caption = input<string>('');
  readonly error = input<string | boolean>(false);
  readonly positive = input<string>('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly counter = input<{ length: number; max?: number } | null>(null);

  protected readonly hasError = computed(() => this.error() !== false && this.error() !== '');
  protected readonly message = computed(() => {
    const e = this.error();
    return (typeof e === 'string' ? e : '') || this.positive() || this.caption();
  });
}

@Component({
  selector: 'bui-s-form-control', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FormControl, Input],
  template: `<div style="display:flex; flex-direction:column; gap:24px; width:320px;">
    <bui-form-control label="E-mail" caption="Usamos para login." [required]="true"><bui-input placeholder="voce@empresa.com" /></bui-form-control>
    <bui-form-control label="Com erro" error="Campo obrigatório."><bui-input [error]="true" /></bui-form-control>
    <bui-form-control label="Com sucesso" positive="Disponível!"><bui-input [positive]="true" /></bui-form-control>
  </div>`,
})
export class FormControlScenario {}
