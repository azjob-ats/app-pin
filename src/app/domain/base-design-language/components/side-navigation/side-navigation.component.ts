import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';

export interface NavItem { key: string; title: string; items?: NavItem[]; }

/** SideNavigation — fiel ao baseui/side-navigation (itens aninhados, ativo). */
@Component({
  selector: 'bui-side-navigation',
  exportAs: 'buiSideNavigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="bui-sn">
      @for (item of items(); track item.key) {
        <button type="button" class="bui-sn__item" [class.bui-sn__item--active]="item.key === activeKey()" (click)="activeKey.set(item.key)">{{ item.title }}</button>
        @if (item.items?.length) {
          <div class="bui-sn__sub">
            @for (sub of item.items; track sub.key) {
              <button type="button" class="bui-sn__item bui-sn__item--sub" [class.bui-sn__item--active]="sub.key === activeKey()" (click)="activeKey.set(sub.key)">{{ sub.title }}</button>
            }
          </div>
        }
      }
    </nav>
  `,
  styles: `
    .bui-sn { display:flex; flex-direction:column; }
    .bui-sn__item { display:block; width:100%; text-align:left; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); border:none; background:transparent; color:var(--bw-content-secondary); font:var(--bw-font-LabelMedium); cursor:pointer; box-shadow:inset 4px 0 0 transparent; }
    .bui-sn__item:hover { color:var(--bw-content-primary); }
    .bui-sn__item--sub { padding-left:var(--bw-sizing-scale900); font:var(--bw-font-ParagraphSmall); }
    .bui-sn__item--active { color:var(--bw-content-primary); font-weight:var(--bw-font-weight-medium); box-shadow:inset 4px 0 0 var(--bw-content-primary); }
  `,
})
export class SideNavigation {
  readonly items = input.required<NavItem[]>();
  readonly activeKey = model<string>('');
}

@Component({
  selector: 'bui-s-side-navigation', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [SideNavigation],
  template: `<div style="width:240px; border:1px solid var(--bw-border-opaque); border-radius:8px; padding:8px 0;">
    <bui-side-navigation [activeKey]="'colors'" [items]="items" />
  </div>`,
})
export class SideNavigationScenario {
  protected readonly items: NavItem[] = [
    { key: 'start', title: 'Getting started' },
    { key: 'foundations', title: 'Foundations', items: [{ key: 'colors', title: 'Colors' }, { key: 'type', title: 'Typography' }] },
    { key: 'components', title: 'Components', items: [{ key: 'button', title: 'Button' }] },
  ];
}
