import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';

export type ToastKind = 'info' | 'positive' | 'warning' | 'negative';
const ICON: Record<ToastKind, string> = { info: 'info', positive: 'check_circle', warning: 'warning', negative: 'error' };

/** Toast — fiel ao baseui/toast (kind colorido + close). */
@Component({
  selector: 'bui-toast',
  exportAs: 'buiToast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="material-symbols-rounded bui-toast__icon">{{ icon() }}</span>
    <span class="bui-toast__msg"><ng-content /></span>
    @if (closeable()) { <button type="button" class="bui-toast__close" aria-label="Close" (click)="closed.emit()"><span class="material-symbols-rounded">close</span></button> }
  `,
  styles: `
    bui-toast { display:inline-flex; align-items:flex-start; gap:var(--bw-sizing-scale400); min-width:280px; max-width:420px; padding:var(--bw-sizing-scale500) var(--bw-sizing-scale600); border-radius:var(--bw-radius-300); color:var(--bw-content-on-color); box-shadow:var(--bw-shadow-600); }
    bui-toast[data-kind="info"] { background:var(--bw-background-accent); }
    bui-toast[data-kind="positive"] { background:var(--bw-background-positive); }
    bui-toast[data-kind="warning"] { background:var(--bw-background-warning); color:var(--bw-content-primary); }
    bui-toast[data-kind="negative"] { background:var(--bw-background-negative); }
    .bui-toast__icon { font-size:20px; flex-shrink:0; }
    .bui-toast__msg { flex:1; font:var(--bw-font-ParagraphSmall); }
    .bui-toast__close { border:none; background:transparent; color:inherit; cursor:pointer; line-height:0; span { font-size:18px; } }
  `,
  host: { role: 'alert', '[attr.data-kind]': 'kind()' },
})
export class Toast {
  readonly kind = input<ToastKind>('info');
  readonly closeable = input(true);
  readonly closed = output<void>();
  protected readonly icon = computed(() => ICON[this.kind()]);
}

@Component({
  selector: 'bui-s-toast', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Toast],
  template: `<div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
    <bui-toast kind="info">Informação enviada.</bui-toast>
    <bui-toast kind="positive">Salvo com sucesso.</bui-toast>
    <bui-toast kind="warning">Atenção: verifique os dados.</bui-toast>
    <bui-toast kind="negative">Falha ao salvar.</bui-toast>
  </div>`,
})
export class ToastScenario {}
