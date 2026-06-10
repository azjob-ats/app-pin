import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Type,
  ViewEncapsulation,
  WritableSignal,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

export type TreeNodeId = string | number;

export interface TreeNodeData {
  id: TreeNodeId;
  label?: string;
  labelComponent?: Type<unknown>;
  isExpanded?: boolean;
  children?: TreeNodeData[];
}

// ── Navigation utilities ──────────────────────────────────────────────────────

function getLastLeafId(node: TreeNodeData): TreeNodeId {
  if (node.isExpanded && node.children?.length) {
    return getLastLeafId(node.children[node.children.length - 1]);
  }
  return node.id;
}

function getParentId(
  nodes: TreeNodeData[],
  nodeId: TreeNodeId,
  parentId: TreeNodeId | null,
): TreeNodeId | null {
  for (const node of nodes) {
    if (node.id === nodeId) return parentId;
    if (node.isExpanded && node.children?.length) {
      const found = getParentId(node.children, nodeId, node.id);
      if (found !== null) return found;
    }
  }
  return null;
}

function getPrevId(
  nodes: TreeNodeData[],
  nodeId: TreeNodeId,
  parentId: TreeNodeId | null,
): TreeNodeId | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) return i === 0 ? parentId : getLastLeafId(nodes[i - 1]);
    if (nodes[i].isExpanded && nodes[i].children?.length) {
      const found = getPrevId(nodes[i].children!, nodeId, nodes[i].id);
      if (found !== null) return found;
    }
  }
  return null;
}

function getNextId(
  nodes: TreeNodeData[],
  nodeId: TreeNodeId,
  parentId: TreeNodeId | null,
): TreeNodeId | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      if (nodes[i].isExpanded && nodes[i].children?.length) return nodes[i].children![0].id;
      if (i + 1 < nodes.length) return nodes[i + 1].id;
      return findNextSiblingUp(nodes, nodeId, parentId);
    }
    if (nodes[i].isExpanded && nodes[i].children?.length) {
      const found = getNextId(nodes[i].children!, nodeId, nodes[i].id);
      if (found !== null) return found;
    }
  }
  return null;
}

function findNextSiblingUp(
  root: TreeNodeData[],
  nodeId: TreeNodeId,
  parentId: TreeNodeId | null,
): TreeNodeId | null {
  if (parentId === null) return null;
  const parent = findNode(root, parentId);
  if (!parent?.children) return null;
  const idx = parent.children.findIndex((n) => n.id === nodeId);
  if (idx + 1 < parent.children.length) return parent.children[idx + 1].id;
  return findNextSiblingUp(root, parentId, getParentId(root, parentId, null));
}

export function findNode(nodes: TreeNodeData[], id: TreeNodeId): TreeNodeData | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getEndId(nodes: TreeNodeData[]): TreeNodeId | null {
  return nodes.length ? getLastLeafId(nodes[nodes.length - 1]) : null;
}

function getExpandableSiblings(nodes: TreeNodeData[], nodeId: TreeNodeId): TreeNodeData[] {
  for (const node of nodes) {
    if (node.id === nodeId) return nodes.filter((n) => n.children?.length);
    if (node.children?.length) {
      const found = getExpandableSiblings(node.children, nodeId);
      if (found.length) return found;
    }
  }
  return [];
}

function flattenVisible(nodes: TreeNodeData[]): TreeNodeData[] {
  const result: TreeNodeData[] = [];
  for (const node of nodes) {
    result.push(node);
    if (node.isExpanded && node.children) result.push(...flattenVisible(node.children));
  }
  return result;
}

function getCharMatchId(
  nodes: TreeNodeData[],
  currentId: TreeNodeId,
  chars: string,
): TreeNodeId | null {
  const flat = flattenVisible(nodes);
  const current = flat.findIndex((n) => n.id === currentId);
  for (let i = 1; i <= flat.length; i++) {
    const candidate = flat[(current + i) % flat.length];
    if (candidate.label?.toLowerCase().startsWith(chars.toLowerCase())) return candidate.id;
  }
  return null;
}

export function findSiblings(
  node: TreeNodeData,
  children: TreeNodeData[],
): TreeNodeData[] | null {
  if (children.includes(node)) return children;
  for (const child of children) {
    if (child.children) {
      const found = findSiblings(node, child.children);
      if (found) return found;
    }
  }
  return null;
}

// ── BuiTreeNodeItem (recursive) ───────────────────────────────────────────────

@Component({
  selector: 'bui-tree-node-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  imports: [NgComponentOutlet, BuiTreeNodeItem],
  template: `
    <li
      #liEl
      role="treeitem"
      class="bui-tv__item"
      [class.bui-tv__item--leaf]="!hasChildren()"
      [attr.data-nodeid]="node().id"
      [attr.tabindex]="isSelected() ? 0 : -1"
      [attr.aria-expanded]="hasChildren() ? !!node().isExpanded : null"
      (keydown)="onKeyDown($event)"
      (focus)="onFocus($event)"
      (blur)="tree.isFocusVisible.set(false)"
    >
      <div
        class="bui-tv__item-content"
        [class.bui-tv__item-content--selected]="isSelected()"
        [class.bui-tv__item-content--focus-visible]="isSelected() && tree.isFocusVisible()"
        (click)="hasChildren() && tree.toggle(node())"
      >
        @if (hasChildren()) {
          <div class="bui-tv__icon-container">
            @if (!node().isExpanded) {
              <!-- chevron right (collapsed) -->
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7071C13.6834 17.0976 14.3166 17.0976 14.7071 16.7071C15.0976 16.3166 15.0976 15.6834 14.7071 15.2929L11.4142 12L14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="currentColor" transform="rotate(180 12 12)" />
              </svg>
            } @else {
              <!-- chevron down (expanded) -->
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7071C13.6834 17.0976 14.3166 17.0976 14.7071 16.7071C15.0976 16.3166 15.0976 15.6834 14.7071 15.2929L11.4142 12L14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z" fill="currentColor" transform="rotate(270 12 12)" />
              </svg>
            }
          </div>
        } @else {
          <div class="bui-tv__icon-container bui-tv__icon-container--blank"></div>
        }

        @if (node().labelComponent) {
          <div class="bui-tv__label-interactable">
            <ng-container *ngComponentOutlet="node().labelComponent!" />
          </div>
        } @else {
          {{ node().label }}
        }
      </div>

      @if (hasChildren() && (node().isExpanded || tree.renderAll())) {
        <ul
          role="group"
          class="bui-tv__item-list bui-tv__item-list--child"
          [class.bui-tv__item-list--hidden]="tree.renderAll() && !node().isExpanded"
        >
          @for (child of node().children; track child.id) {
            <bui-tree-node-item [node]="child" />
          }
        </ul>
      }
    </li>
  `,
})
export class BuiTreeNodeItem {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  protected readonly tree = inject(BuiTreeView);
  private readonly el = inject(ElementRef) as ElementRef<HTMLElement>;

  readonly node = input.required<TreeNodeData>();

  protected readonly hasChildren = computed(() => !!this.node().children?.length);
  protected readonly isSelected = computed(() => this.tree.selectedNodeId() === this.node().id);

  protected onFocus(e: FocusEvent): void {
    if (e.target !== this.el.nativeElement.querySelector('li')) return;
    this.tree.selectedNodeId.set(this.node().id);
  }

  protected onKeyDown(e: KeyboardEvent): void {
    const elementId = (e.currentTarget as HTMLElement).getAttribute('data-nodeid');
    const nodeId = this.node().id;
    if (elementId !== String(nodeId) && Number(elementId) !== nodeId) return;
    this.tree.handleKeyDown(e, this.node());
  }
}

// ── BuiTreeView ───────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-tree-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTreeNodeItem],
  styleUrl: './tree-view.component.scss',
  template: `
    <ul class="bui-tv__list" role="tree">
      @for (node of data(); track node.id) {
        <bui-tree-node-item [node]="node" />
      }
    </ul>
  `,
})
export class BuiTreeView {
  readonly data = input.required<TreeNodeData[]>();
  readonly renderAll = input(false, { transform: booleanAttribute });
  readonly singleExpanded = input(false, { transform: booleanAttribute });
  readonly onToggle = input<(node: TreeNodeData) => void>();

  readonly selectedNodeId: WritableSignal<TreeNodeId | null> = signal(null);
  readonly isFocusVisible: WritableSignal<boolean> = signal(false);

  private typeAheadChars = '';
  private typeAheadTimer: ReturnType<typeof setTimeout> | null = null;

  toggle(node: TreeNodeData): void {
    const cb = this.onToggle();
    if (cb) cb(node);
    this.focusNode(node.id);
  }

  focusNode(id: TreeNodeId | null): void {
    if (!id) return;
    this.selectedNodeId.set(id);
    setTimeout(() => {
      const el = document.querySelector(`[data-nodeid="${id}"]`) as HTMLElement | null;
      if (el) el.focus();
    });
  }

  handleKeyDown(e: KeyboardEvent, node: TreeNodeData): void {
    const data = this.data();
    const selectedId = this.selectedNodeId();

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (node.children?.length && !node.isExpanded) {
          this.toggle(node);
        } else {
          this.focusNode(node.children?.[0]?.id ?? null);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (node.isExpanded) {
          this.toggle(node);
        } else {
          this.focusNode(getParentId(data, node.id, null));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.isFocusVisible.set(true);
        this.focusNode(getPrevId(data, node.id, null));
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.isFocusVisible.set(true);
        this.focusNode(getNextId(data, node.id, null));
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        this.toggle(node);
        break;
      case 'Home':
        e.preventDefault();
        if (data.length) this.focusNode(data[0].id);
        break;
      case 'End':
        e.preventDefault();
        this.focusNode(getEndId(data));
        break;
      case '*': {
        e.preventDefault();
        const expandable = getExpandableSiblings(data, node.id);
        expandable.forEach((s) => this.toggle(s));
        break;
      }
      default:
        if (this.typeAheadTimer !== null) clearTimeout(this.typeAheadTimer);
        this.typeAheadChars += e.key;
        this.typeAheadTimer = setTimeout(() => {
          this.typeAheadChars = '';
        }, 500);
        if (selectedId !== null) {
          this.focusNode(getCharMatchId(data, selectedId, this.typeAheadChars));
        }
        break;
    }
  }
}

// ── BuiStatefulTreeView ───────────────────────────────────────────────────────

@Component({
  selector: 'bui-stateful-tree-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTreeView],
  template: `
    <bui-tree-view
      [data]="_data()"
      [renderAll]="renderAll()"
      [singleExpanded]="singleExpanded()"
      [onToggle]="handleToggle"
    />
  `,
})
export class BuiStatefulTreeView {
  readonly data = input.required<TreeNodeData[]>();
  readonly renderAll = input(false, { transform: booleanAttribute });
  readonly singleExpanded = input(false, { transform: booleanAttribute });

  protected readonly _data = signal<TreeNodeData[]>([]);

  ngOnInit(): void {
    this._data.set(JSON.parse(JSON.stringify(this.data())));
  }

  protected readonly handleToggle = (node: TreeNodeData): void => {
    const shouldExpand = !node.isExpanded;

    this._data.update((data) => {
      const cloned: TreeNodeData[] = JSON.parse(JSON.stringify(data));
      const target = findNode(cloned, node.id);
      if (!target) return data;

      if (this.singleExpanded() && shouldExpand) {
        const siblings = findSiblings(target, cloned);
        if (siblings) siblings.forEach((s) => { if (s.id !== node.id) s.isExpanded = false; });
      }

      target.isExpanded = shouldExpand;
      return cloned;
    });
  };
}
