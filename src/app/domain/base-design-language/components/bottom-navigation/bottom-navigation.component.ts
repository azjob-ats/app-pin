import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';

export interface BottomNavItem { key: string; label: string; icon: string; }

/** BottomNavigation — fiel ao baseui/bottom-navigation (ícone + label, ativo). */
@Component({
  selector: 'bui-bottom-navigation',
  exportAs: 'buiBottomNavigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="bui-bn">
      @for (i of items(); track i.key) {
        <button type="button" class="bui-bn__item" [class.bui-bn__item--active]="i.key === activeKey()" (click)="activeKey.set(i.key)">
          <span class="material-symbols-rounded">{{ i.icon }}</span>
          <span class="bui-bn__label">{{ i.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: `
    .bui-bn { display:flex; border-top:1px solid var(--bw-border-opaque); background:var(--bw-background-primary); }
    .bui-bn__item { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; padding:var(--bw-sizing-scale400) 0; border:none; background:transparent; color:var(--bw-content-tertiary); cursor:pointer; }
    .bui-bn__item span:first-child { font-size:24px; }
    .bui-bn__label { font:var(--bw-font-LabelXSmall); }
    .bui-bn__item--active { color:var(--bw-content-primary); }
  `,
})
export class BottomNavigation {
  readonly items = input.required<BottomNavItem[]>();
  readonly activeKey = model<string>('');
}

@Component({
  selector: 'bui-s-bottom-navigation', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BottomNavigation],
  template: `<div style="width:360px; border:1px solid var(--bw-border-opaque); border-radius:8px; overflow:hidden;">
    <bui-bottom-navigation [activeKey]="'home'" [items]="[{key:'home',label:'Home',icon:'home'},{key:'search',label:'Search',icon:'search'},{key:'profile',label:'Profile',icon:'person'}]" />
  </div>`,
})
export class BottomNavigationScenario {}
