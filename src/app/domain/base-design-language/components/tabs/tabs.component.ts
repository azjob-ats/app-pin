import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  contentChildren,
  inject,
  input,
  model,
} from '@angular/core';

/** Tab — uma aba (title + conteúdo projetado). */
@Component({
  selector: 'bui-tab',
  exportAs: 'buiTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-tab { display:block; padding:var(--bw-sizing-scale700) 0; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); } bui-tab[hidden] { display:none; }`,
  host: { role: 'tabpanel', '[hidden]': '!active()' },
})
export class Tab {
  readonly tabKey = input.required<string>();
  readonly title = input.required<string>();
  private readonly tabs = inject(Tabs);
  readonly active = computed(() => this.tabs.activeKey() === this.tabKey());
}

/** Tabs — fiel ao baseui/tabs (barra + indicador ativo). */
@Component({
  selector: 'bui-tabs',
  exportAs: 'buiTabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-tabs__bar" role="tablist">
      @for (t of tabList(); track t.key) {
        <button type="button" role="tab" class="bui-tabs__tab" [class.bui-tabs__tab--active]="t.key === activeKey()" [attr.aria-selected]="t.key === activeKey()" (click)="activeKey.set(t.key)">
          {{ t.title }}
        </button>
      }
    </div>
    <div class="bui-tabs__panels"><ng-content select="bui-tab" /></div>
  `,
  styles: `
    bui-tabs { display:block; }
    .bui-tabs__bar { display:flex; gap:var(--bw-sizing-scale700); border-bottom:1px solid var(--bw-border-opaque); }
    .bui-tabs__tab { position:relative; padding:var(--bw-sizing-scale500) 0; border:none; background:transparent; color:var(--bw-content-secondary); font:var(--bw-font-LabelMedium); cursor:pointer; }
    .bui-tabs__tab:hover { color:var(--bw-content-primary); }
    .bui-tabs__tab--active { color:var(--bw-content-primary); }
    .bui-tabs__tab--active::after { content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--bw-content-primary); transition:all var(--bw-timing-300) var(--bw-ease-out); }
  `,
})
export class Tabs {
  readonly activeKey = model<string>('');
  private readonly tabs = contentChildren(Tab);
  protected readonly tabList = computed(() => this.tabs().map((t) => ({ key: t.tabKey(), title: t.title() })));
}

@Component({
  selector: 'bui-s-tabs', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Tabs, Tab],
  template: `<div style="width:520px;">
    <bui-tabs [activeKey]="'1'">
      <bui-tab tabKey="1" title="Overview">Conteúdo da aba Overview.</bui-tab>
      <bui-tab tabKey="2" title="Specs">Conteúdo da aba Specs.</bui-tab>
      <bui-tab tabKey="3" title="Reviews">Conteúdo da aba Reviews.</bui-tab>
    </bui-tabs>
  </div>`,
})
export class TabsScenario {}
