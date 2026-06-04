import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** MobileHeader — fiel ao baseui/mobile-header (back + título + ações). */
@Component({
  selector: 'bui-mobile-header',
  exportAs: 'buiMobileHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button type="button" class="bui-mh__btn" aria-label="Back"><span class="material-symbols-rounded">arrow_back</span></button>
    <span class="bui-mh__title">{{ title() }}</span>
    <span class="bui-mh__actions"><ng-content /></span>
  `,
  styles: `
    bui-mobile-header { display:flex; align-items:center; gap:var(--bw-sizing-scale400); height:56px; padding:0 var(--bw-sizing-scale400); border-bottom:1px solid var(--bw-border-opaque); }
    bui-mobile-header[data-type="floating"] { border-bottom:none; border-radius:var(--bw-radius-300); box-shadow:var(--bw-shadow-500); margin:var(--bw-sizing-scale400); }
    .bui-mh__btn { display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border:none; border-radius:50%; background:transparent; color:var(--bw-content-primary); cursor:pointer; }
    .bui-mh__btn:hover { background:var(--bw-background-secondary); }
    .bui-mh__title { flex:1; font:var(--bw-font-LabelLarge); color:var(--bw-content-primary); }
    .bui-mh__actions { display:flex; gap:var(--bw-sizing-scale200); }
  `,
  host: { '[attr.data-type]': 'type()' },
})
export class MobileHeader {
  readonly title = input<string>('');
  readonly type = input<'fixed' | 'floating'>('fixed');
}

@Component({
  selector: 'bui-s-mobile-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MobileHeader],
  template: `<div style="width:360px; border:1px solid var(--bw-border-opaque); border-radius:8px; overflow:hidden;">
    <bui-mobile-header title="Settings"><span class="material-symbols-rounded">more_vert</span></bui-mobile-header>
  </div>`,
})
export class MobileHeaderScenario {}
