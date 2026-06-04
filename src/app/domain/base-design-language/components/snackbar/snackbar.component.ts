import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

/** Snackbar — fiel ao baseui/snackbar (barra escura + mensagem + ação). */
@Component({
  selector: 'bui-snackbar',
  exportAs: 'buiSnackbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (startEnhancer()) { <span class="material-symbols-rounded bui-sb__icon">{{ startEnhancer() }}</span> }
    <span class="bui-sb__msg"><ng-content /></span>
    @if (actionLabel()) { <button type="button" class="bui-sb__action" (click)="action.emit()">{{ actionLabel() }}</button> }
  `,
  styles: `
    bui-snackbar { display:inline-flex; align-items:center; gap:var(--bw-sizing-scale400); min-height:48px; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); border-radius:var(--bw-radius-300); background:var(--bw-background-inverse-primary); color:var(--bw-content-inverse-primary); box-shadow:var(--bw-shadow-600); }
    .bui-sb__icon { font-size:20px; }
    .bui-sb__msg { flex:1; font:var(--bw-font-ParagraphSmall); }
    .bui-sb__action { border:none; background:transparent; color:var(--bw-content-inverse-primary); font:var(--bw-font-LabelSmall); text-transform:uppercase; cursor:pointer; }
    .bui-sb__action:hover { text-decoration:underline; }
  `,
  host: { role: 'status' },
})
export class Snackbar {
  readonly actionLabel = input<string>('');
  readonly startEnhancer = input<string>('');
  readonly action = output<void>();
}

@Component({
  selector: 'bui-s-snackbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Snackbar],
  template: `<div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
    <bui-snackbar startEnhancer="check_circle" actionLabel="Undo">Item arquivado.</bui-snackbar>
    <bui-snackbar>Alterações salvas.</bui-snackbar>
  </div>`,
})
export class SnackbarScenario {}
