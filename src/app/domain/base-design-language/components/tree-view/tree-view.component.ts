import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal } from '@angular/core';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

/** TreeView — fiel ao baseui/tree-view (nós expansíveis, recursivo). */
@Component({
  selector: 'bui-tree-view',
  exportAs: 'buiTreeView',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #tree let-list>
      <ul class="bui-tree__list">
        @for (n of list; track n.id) {
          <li class="bui-tree__item">
            <button type="button" class="bui-tree__row" (click)="toggle(n)">
              <span class="material-symbols-rounded bui-tree__chev" [class.bui-tree__chev--open]="open().has(n.id)" [style.visibility]="n.children?.length ? 'visible' : 'hidden'">chevron_right</span>
              {{ n.label }}
            </button>
            @if (n.children?.length && open().has(n.id)) {
              <div class="bui-tree__children">
                <ng-container *ngTemplateOutlet="tree; context: { $implicit: n.children }" />
              </div>
            }
          </li>
        }
      </ul>
    </ng-template>
    <ng-container *ngTemplateOutlet="tree; context: { $implicit: nodes() }" />
  `,
  styles: `
    bui-tree-view { display:block; }
    .bui-tree__list { list-style:none; margin:0; padding:0; }
    .bui-tree__children { padding-left:var(--bw-sizing-scale700); }
    .bui-tree__row { display:flex; align-items:center; gap:var(--bw-sizing-scale200); width:100%; padding:var(--bw-sizing-scale300) var(--bw-sizing-scale400); border:none; background:transparent; color:var(--bw-content-primary); font:var(--bw-font-ParagraphSmall); text-align:left; cursor:pointer; border-radius:var(--bw-radius-200); }
    .bui-tree__row:hover { background:var(--bw-background-secondary); }
    .bui-tree__chev { font-size:18px; color:var(--bw-content-tertiary); transition:transform var(--bw-timing-150) var(--bw-ease-out); }
    .bui-tree__chev--open { transform:rotate(90deg); }
  `,
})
export class TreeView {
  readonly nodes = input.required<TreeNode[]>();
  protected readonly open = signal<Set<string>>(new Set());
  protected toggle(n: TreeNode): void {
    if (!n.children?.length) return;
    this.open.update((s) => { const x = new Set(s); x.has(n.id) ? x.delete(n.id) : x.add(n.id); return x; });
  }
}

@Component({
  selector: 'bui-s-tree-view', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [TreeView],
  template: `<div style="width:320px;"><bui-tree-view [nodes]="nodes" /></div>`,
})
export class TreeViewScenario {
  protected readonly nodes: TreeNode[] = [
    { id: '1', label: 'Components', children: [
      { id: '1a', label: 'Inputs', children: [{ id: 'b', label: 'Button' }, { id: 'c', label: 'Checkbox' }] },
      { id: '1b', label: 'Navigation', children: [{ id: 't', label: 'Tabs' }] },
    ] },
    { id: '2', label: 'Foundations', children: [{ id: 'co', label: 'Colors' }, { id: 'ty', label: 'Typography' }] },
  ];
}
