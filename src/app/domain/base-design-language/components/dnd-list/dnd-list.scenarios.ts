import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiDndList } from './dnd-list.component';

/** Scenario portada de `src/dnd-list/__tests__/dnd-list.scenario.tsx`. */

// dnd-list.scenario.tsx — StatefulList 6 itens, Root width 344px.
@Component({
  selector: 'bui-s-dnd-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDndList],
  template: `<bui-dnd-list style="width:344px" [items]="items" />`,
})
export class DndListScenario {
  protected readonly items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];
}
