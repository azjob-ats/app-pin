import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface KanbanColumn {
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly description?: string;
  readonly canCreate?: boolean;
}

export interface KanbanMoveEvent<T> {
  readonly item: T;
  readonly fromColumnId: string;
  readonly toColumnId: string;
}

export interface KanbanCardContext<T> {
  readonly $implicit: T;
  readonly item: T;
  readonly columnId: string;
}

@Component({
  selector: 'app-kanban-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, NgTemplateOutlet],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent<T> {
  readonly columns = input.required<readonly KanbanColumn[]>();
  readonly items = input.required<readonly T[]>();
  readonly itemColumnKey = input.required<(item: T) => string>();
  readonly itemId = input.required<(item: T) => string>();
  readonly cardTemplate = input.required<TemplateRef<KanbanCardContext<T>>>();
  readonly canAddPhase = input<boolean>(false);
  readonly canCreateInPhase = input<(columnId: string) => boolean>(() => false);
  readonly isMovingItem = input<(itemId: string) => boolean>(() => false);

  readonly itemMoved = output<KanbanMoveEvent<T>>();
  readonly addPhaseRequested = output<void>();
  readonly createInPhaseRequested = output<string>();
  readonly itemClicked = output<T>();

  readonly grouped = computed<ReadonlyMap<string, readonly T[]>>(() => {
    const result = new Map<string, T[]>();
    for (const column of this.columns()) {
      result.set(column.id, []);
    }
    const getKey = this.itemColumnKey();
    for (const item of this.items()) {
      const key = getKey(item);
      if (!result.has(key)) result.set(key, []);
      result.get(key)!.push(item);
    }
    return result;
  });

  readonly connectedListIds = computed(() => this.columns().map((c) => this.dropListId(c.id)));

  protected itemsFor(columnId: string): readonly T[] {
    return this.grouped().get(columnId) ?? [];
  }

  protected countOf(columnId: string): number {
    return this.itemsFor(columnId).length;
  }

  protected dropListId(columnId: string): string {
    return `kanban-${columnId}`;
  }

  protected onDrop(event: CdkDragDrop<string>): void {
    const item = event.item.data as T;
    const fromColumnId = event.previousContainer.data;
    const toColumnId = event.container.data;
    if (fromColumnId === toColumnId) return;
    this.itemMoved.emit({ item, fromColumnId, toColumnId });
  }

  protected onAddPhase(): void {
    this.addPhaseRequested.emit();
  }

  protected onCreateInPhase(columnId: string): void {
    this.createInPhaseRequested.emit(columnId);
  }

  protected onItemClick(item: T): void {
    this.itemClicked.emit(item);
  }

  protected trackByColumn(_: number, column: KanbanColumn): string {
    return column.id;
  }

  protected trackByItem = (_: number, item: T): string => this.itemId()(item);
}
