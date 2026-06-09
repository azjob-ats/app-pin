import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { Button } from '../button/button.component';
import { BuiInput } from '../input/input.component';
import { BuiCheckIndeterminate, BuiPlus } from '../icon/icon.component';

/**
 * Stepper — clone fiel do `baseui/stepper`. Linha de 139×48 com botão `−`
 * (DecrementButton), o valor (Input central 36×36) e botão `+` (IncrementButton). Os
 * botões são `bui-button` circle/secondary/compact; decremento desabilita em `minValue`,
 * incremento em `maxValue`. Reusa Button, Input e os ícones CheckIndeterminate/Plus.
 */
@Component({
  selector: 'bui-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiInput, BuiCheckIndeterminate, BuiPlus],
  styleUrl: './stepper.component.scss',
  template: `
    <bui-button
      shape="circle"
      kind="secondary"
      size="compact"
      ariaLabel="decrement value"
      [disabled]="decDisabled()"
      (buttonClick)="setValue(value() - 1)"
    >
      <bui-check-indeterminate />
    </bui-button>
    <bui-input class="bui-stepper__input" [value]="display()" [disabled]="disabled()" ariaLabel="value" (valueChange)="onInput($event)" />
    <bui-button
      shape="circle"
      kind="secondary"
      size="compact"
      ariaLabel="increment value"
      [disabled]="incDisabled()"
      (buttonClick)="setValue(value() + 1)"
    >
      <bui-plus />
    </bui-button>
  `,
  host: { class: 'bui-stepper' },
})
export class BuiStepper {
  readonly value = input(0, { transform: numberAttribute });
  readonly minValue = input(0, { transform: numberAttribute });
  readonly maxValue = input<number | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly valueChange = output<number>();

  protected readonly display = computed(() => String(this.value()));
  protected readonly decDisabled = computed(() => this.disabled() || this.value() <= this.minValue());
  protected readonly incDisabled = computed(() => this.disabled() || (this.maxValue() != null && this.value() >= this.maxValue()!));

  protected setValue(v: number): void {
    this.valueChange.emit(v);
  }
  protected onInput(v: string): void {
    const n = Number(v);
    if (!isNaN(n) && (this.maxValue() == null || n <= this.maxValue()!) && n >= this.minValue()) {
      this.valueChange.emit(n);
    }
  }
}
