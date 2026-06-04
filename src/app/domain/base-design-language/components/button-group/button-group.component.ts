import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, signal } from '@angular/core';
import { Button } from '../button/button.component';

export interface BGItem { key: string; label: string; }

/** ButtonGroup — fiel ao baseui/button-group (MODE radio/checkbox; usa Button). */
@Component({
  selector: 'bui-button-group',
  exportAs: 'buiButtonGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    @for (it of items(); track it.key) {
      <bui-button kind="secondary" [isSelected]="isOn(it.key)" (buttonClick)="pick(it.key)">{{ it.label }}</bui-button>
    }
  `,
  styles: `bui-button-group { display:inline-flex; gap:var(--bw-sizing-scale100); }`,
})
export class ButtonGroup {
  readonly items = input<BGItem[]>([]);
  readonly mode = input<'radio' | 'checkbox'>('radio');
  readonly selected = model<string>('');
  private readonly checks = signal<Set<string>>(new Set());

  protected isOn(key: string): boolean {
    return this.mode() === 'radio' ? this.selected() === key : this.checks().has(key);
  }
  protected pick(key: string): void {
    if (this.mode() === 'radio') { this.selected.set(key); return; }
    this.checks.update((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
}

@Component({
  selector: 'bui-s-button-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ButtonGroup],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
    <bui-button-group [selected]="'b'" [items]="[{key:'a',label:'Day'},{key:'b',label:'Week'},{key:'c',label:'Month'}]" />
    <bui-button-group mode="checkbox" [items]="[{key:'bold',label:'Bold'},{key:'italic',label:'Italic'},{key:'under',label:'Underline'}]" />
  </div>`,
})
export class ButtonGroupScenario {}
