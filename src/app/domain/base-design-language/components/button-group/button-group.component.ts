import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  signal,
} from '@angular/core';
import { Kind, Shape, Size } from '../button/button.model';
import { BUI_BTN_GRP } from './button-group.token';

export type ButtonGroupMode = 'radio' | 'checkbox';
export type ButtonGroupPadding = 'default' | 'none' | 'custom';

@Component({
  selector: 'bui-button-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './button-group.component.scss',
  providers: [{ provide: BUI_BTN_GRP, useExisting: BuiButtonGroup }],
  template: `
    <div
      class="bui-button-group"
      [class]="rootClass()"
      [attr.role]="mode() === 'radio' ? 'radiogroup' : 'group'"
      [attr.aria-label]="ariaLabel() || 'Button group'"
      data-baseweb="button-group"
    >
      <ng-content />
    </div>
  `,
})
export class BuiButtonGroup {
  readonly kind = input<Kind>('secondary');
  readonly size = input<Size>('default');
  readonly shape = input<Shape>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly mode = input<ButtonGroupMode | undefined>(undefined);
  readonly wrap = input<boolean | undefined>(undefined);
  readonly padding = input<ButtonGroupPadding>('none');
  readonly selected = input<number | number[] | undefined>(undefined);
  readonly initialState = input<{ selected?: number | number[] } | undefined>(undefined);
  readonly ariaLabel = input<string>('');

  private _nextIndex = 0;
  private readonly _statefulSelected = signal<number | number[] | undefined>(undefined);

  constructor() {
    // Initialize stateful selected from initialState
    const init = this.initialState()?.selected;
    if (init !== undefined) this._statefulSelected.set(init);
  }

  readonly effectiveSelected = computed(
    () => this.selected() ?? this._statefulSelected(),
  );

  registerChild(): number {
    return this._nextIndex++;
  }

  onChildClick(index: number): void {
    const m = this.mode();
    if (!m) return;
    this._statefulSelected.update((cur) => {
      if (m === 'radio') return index;
      const arr: number[] = Array.isArray(cur) ? [...cur] : [];
      const i = arr.indexOf(index);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(index);
      return arr;
    });
  }

  protected readonly rootClass = computed(() => {
    const parts = ['bui-button-group'];
    const w = this.wrap();
    if (w === true) parts.push('bui-button-group--wrap');
    if (w === false) parts.push('bui-button-group--nowrap');
    const p = this.padding();
    if (p === 'default') parts.push('bui-button-group--pad-default');
    if (p === 'custom') parts.push('bui-button-group--pad-custom');
    const s = this.size();
    if (s === 'xSmall' || s === 'mini') parts.push('bui-button-group--xsmall');
    return parts.join(' ');
  });
}
