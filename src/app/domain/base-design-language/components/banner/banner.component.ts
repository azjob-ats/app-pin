import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';

export type BannerKind = 'info' | 'positive' | 'warning' | 'negative';

const ICON: Record<BannerKind, string> = { info: 'info', positive: 'check_circle', warning: 'warning', negative: 'error' };

/** Banner — fiel ao baseui/banner (kind info/positive/warning/negative, artwork, ação, dismissable). */
@Component({
  selector: 'bui-banner',
  exportAs: 'buiBanner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="material-symbols-rounded bui-banner__icon">{{ icon() }}</span>
    <div class="bui-banner__content">
      @if (title()) { <div class="bui-banner__title">{{ title() }}</div> }
      <div class="bui-banner__message"><ng-content /></div>
    </div>
    @if (dismissable()) {
      <button type="button" class="bui-banner__close" aria-label="Dismiss" (click)="dismissed.emit()"><span class="material-symbols-rounded">close</span></button>
    }
  `,
  styles: `
    bui-banner { display:flex; align-items:flex-start; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); border-radius:var(--bw-radius-300); }
    bui-banner[data-kind="info"] { background:var(--bw-background-accent-light); color:var(--bw-content-primary); }
    bui-banner[data-kind="positive"] { background:var(--bw-background-positive-light); }
    bui-banner[data-kind="warning"] { background:var(--bw-background-warning-light); }
    bui-banner[data-kind="negative"] { background:var(--bw-background-negative-light); }
    .bui-banner__icon { flex-shrink:0; font-size:20px; }
    bui-banner[data-kind="info"] .bui-banner__icon { color:var(--bw-content-accent); }
    bui-banner[data-kind="positive"] .bui-banner__icon { color:var(--bw-content-positive); }
    bui-banner[data-kind="warning"] .bui-banner__icon { color:var(--bw-content-warning); }
    bui-banner[data-kind="negative"] .bui-banner__icon { color:var(--bw-content-negative); }
    .bui-banner__content { flex:1; min-width:0; }
    .bui-banner__title { font:var(--bw-font-LabelMedium); color:var(--bw-content-primary); }
    .bui-banner__message { font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary); }
    .bui-banner__close { flex-shrink:0; border:none; background:transparent; color:var(--bw-content-secondary); cursor:pointer; line-height:0; span { font-size:18px; } }
  `,
  host: { role: 'status', '[attr.data-kind]': 'kind()' },
})
export class Banner {
  readonly kind = input<BannerKind>('info');
  readonly title = input<string>('');
  readonly dismissable = input(false);
  readonly dismissed = output<void>();
  protected readonly icon = computed(() => ICON[this.kind()]);
}

/** SystemBanner — banner full-width (topo). */
@Component({
  selector: 'bui-system-banner',
  exportAs: 'buiSystemBanner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<span class="material-symbols-rounded">campaign</span><div class="bui-sb__msg"><ng-content /></div>',
  styles: `
    bui-system-banner { display:flex; align-items:center; gap:var(--bw-sizing-scale400); width:100%; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale700); background:var(--bw-background-inverse-primary); color:var(--bw-content-inverse-primary); }
    bui-system-banner span { font-size:20px; }
    .bui-sb__msg { font:var(--bw-font-LabelSmall); }
  `,
  host: { role: 'status' },
})
export class SystemBanner {}

@Component({
  selector: 'bui-s-banner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Banner],
  template: `<div style="display:flex; flex-direction:column; gap:12px; width:480px;">
    <bui-banner kind="info" title="Information">Mensagem informativa do banner.</bui-banner>
    <bui-banner kind="positive" title="Success" [dismissable]="true">Operação concluída.</bui-banner>
    <bui-banner kind="warning" title="Warning">Atenção a este ponto.</bui-banner>
    <bui-banner kind="negative" title="Error">Algo deu errado.</bui-banner>
  </div>`,
})
export class BannerScenario {}

@Component({
  selector: 'bui-s-system-banner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [SystemBanner],
  template: `<div style="width:600px;"><bui-system-banner>Manutenção programada para hoje às 22h.</bui-system-banner></div>`,
})
export class SystemBannerScenario {}
