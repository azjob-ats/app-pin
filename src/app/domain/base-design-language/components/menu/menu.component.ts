import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

export interface MenuItem { label: string; icon?: string; disabled?: boolean; }

/** Menu — fiel ao baseui/menu (lista de itens; usado solto ou dentro de Popover). */
@Component({
  selector: 'bui-menu',
  exportAs: 'buiMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="bui-menu" role="menu">
      @for (item of items(); track $index) {
        <li>
          <button type="button" class="bui-menu__item" role="menuitem" [disabled]="item.disabled" (click)="itemClick.emit(item)">
            @if (item.icon) { <span class="material-symbols-rounded bui-menu__icon">{{ item.icon }}</span> }
            {{ item.label }}
          </button>
        </li>
      }
    </ul>
  `,
  styles: `
    .bui-menu { list-style:none; margin:0; padding:var(--bw-sizing-scale200); min-width:200px; }
    .bui-menu__item { display:flex; align-items:center; gap:var(--bw-sizing-scale400); width:100%; text-align:left; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale500); border:none; border-radius:var(--bw-radius-200); background:transparent; color:var(--bw-content-primary); font:var(--bw-font-ParagraphMedium); cursor:pointer; }
    .bui-menu__item:hover:not(:disabled) { background:var(--bw-background-secondary); }
    .bui-menu__item:disabled { color:var(--bw-content-state-disabled); cursor:not-allowed; }
    .bui-menu__icon { font-size:20px; color:var(--bw-content-secondary); }
  `,
})
export class Menu {
  readonly items = input.required<MenuItem[]>();
  readonly itemClick = output<MenuItem>();
}

@Component({
  selector: 'bui-s-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Menu],
  template: `<div style="width:220px; border:1px solid var(--bw-border-opaque); border-radius:8px; box-shadow:var(--bw-shadow-500);">
    <bui-menu [items]="[{label:'Edit',icon:'edit'},{label:'Duplicate',icon:'content_copy'},{label:'Archive',icon:'archive'},{label:'Delete',icon:'delete',disabled:true}]" />
  </div>`,
})
export class MenuScenario {}
