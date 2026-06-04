import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal } from '@angular/core';

/** DndList — fiel ao baseui/dnd-list (lista reordenável com handle). Reorder via HTML5 drag. */
@Component({
  selector: 'bui-dnd-list',
  exportAs: 'buiDndList',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="bui-dnd">
      @for (it of list(); track it; let i = $index) {
        <li
          class="bui-dnd__item"
          draggable="true"
          (dragstart)="from = i"
          (dragover)="$event.preventDefault()"
          (drop)="drop(i)"
        >
          <span class="material-symbols-rounded bui-dnd__handle">drag_indicator</span>
          <span class="bui-dnd__label">{{ it }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    .bui-dnd { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--bw-sizing-scale300); }
    .bui-dnd__item { display:flex; align-items:center; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale400) var(--bw-sizing-scale500); border:1px solid var(--bw-border-opaque); border-radius:var(--bw-radius-300); background:var(--bw-background-primary); cursor:grab; }
    .bui-dnd__item:active { cursor:grabbing; box-shadow:var(--bw-shadow-500); }
    .bui-dnd__handle { color:var(--bw-content-tertiary); }
    .bui-dnd__label { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
  `,
})
export class DndList {
  readonly items = input.required<string[]>();
  protected readonly list = signal<string[]>([]);
  protected from = -1;

  constructor() {
    queueMicrotask(() => this.list.set([...this.items()]));
  }
  protected drop(to: number): void {
    if (this.from < 0 || this.from === to) return;
    this.list.update((arr) => {
      const next = [...arr];
      const [moved] = next.splice(this.from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    this.from = -1;
  }
}

@Component({
  selector: 'bui-s-dnd-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [DndList],
  template: `<div style="width:320px;"><bui-dnd-list [items]="['Item 1','Item 2','Item 3','Item 4']" /></div>`,
})
export class DndListScenario {}
