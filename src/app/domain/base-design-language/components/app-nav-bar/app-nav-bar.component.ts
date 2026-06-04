import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';

export interface AppNavItem { key: string; label: string; }

/** AppNavBar (Navigation Bar) — fiel ao baseui/app-nav-bar (logo + itens principais + usuário). */
@Component({
  selector: 'bui-app-nav-bar',
  exportAs: 'buiAppNavBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="bui-anb__title">{{ appDisplayName() }}</span>
    <nav class="bui-anb__main">
      @for (i of mainItems(); track i.key) {
        <button type="button" class="bui-anb__item" [class.bui-anb__item--active]="i.key === activeKey()" (click)="activeKey.set(i.key)">{{ i.label }}</button>
      }
    </nav>
    <span class="material-symbols-rounded bui-anb__user">account_circle</span>
  `,
  styles: `
    bui-app-nav-bar { display:flex; align-items:center; gap:var(--bw-sizing-scale700); padding:var(--bw-sizing-scale400) var(--bw-sizing-scale700); border-bottom:1px solid var(--bw-border-opaque); }
    .bui-anb__title { font:var(--bw-font-LabelLarge); color:var(--bw-content-primary); }
    .bui-anb__main { display:flex; gap:var(--bw-sizing-scale600); }
    .bui-anb__item { position:relative; padding:var(--bw-sizing-scale300) 0; border:none; background:transparent; color:var(--bw-content-secondary); font:var(--bw-font-LabelMedium); cursor:pointer; }
    .bui-anb__item--active { color:var(--bw-content-primary); }
    .bui-anb__item--active::after { content:''; position:absolute; left:0; right:0; bottom:-12px; height:2px; background:var(--bw-content-primary); }
    .bui-anb__user { margin-left:auto; font-size:28px; color:var(--bw-content-secondary); }
  `,
})
export class AppNavBar {
  readonly appDisplayName = input<string>('App');
  readonly mainItems = input<AppNavItem[]>([]);
  readonly activeKey = model<string>('');
}

@Component({
  selector: 'bui-s-app-nav-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [AppNavBar],
  template: `<div style="width:640px; border:1px solid var(--bw-border-opaque); border-radius:8px;">
    <bui-app-nav-bar appDisplayName="◆ Acme" [activeKey]="'home'" [mainItems]="[{key:'home',label:'Home'},{key:'team',label:'Team'},{key:'reports',label:'Reports'}]" />
  </div>`,
})
export class AppNavBarScenario {}
