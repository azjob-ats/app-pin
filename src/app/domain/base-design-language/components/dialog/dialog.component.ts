import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, signal } from '@angular/core';

/** Dialog — fiel ao baseui (alert/confirm: título + mensagem + ações). */
@Component({
  selector: 'bui-dialog',
  exportAs: 'buiDialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="bui-dlg__backdrop" (click)="open.set(false)"></div>
      <div class="bui-dlg" [attr.role]="role()" aria-modal="true">
        <div class="bui-dlg__title">{{ title() }}</div>
        <p class="bui-dlg__msg">{{ message() }}</p>
        <div class="bui-dlg__actions"><ng-content select="[buiActions]" /></div>
      </div>
    }
  `,
  styles: `
    .bui-dlg__backdrop { position:fixed; inset:0; z-index:var(--bw-z-modal); background:var(--bw-background-overlay); }
    .bui-dlg { position:fixed; z-index:calc(var(--bw-z-modal) + 1); top:50%; left:50%; transform:translate(-50%,-50%); width:min(420px,92vw); display:flex; flex-direction:column; gap:var(--bw-sizing-scale500); padding:var(--bw-sizing-scale800); border-radius:var(--bw-radius-300); background:var(--bw-background-primary); box-shadow:var(--bw-shadow-700); }
    .bui-dlg__title { font:var(--bw-font-HeadingXSmall); color:var(--bw-content-primary); }
    .bui-dlg__msg { margin:0; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-secondary); }
    .bui-dlg__actions { display:flex; justify-content:flex-end; gap:var(--bw-sizing-scale400); }
  `,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Dialog {
  readonly open = model(false);
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly role = input<'dialog' | 'alertdialog'>('alertdialog');
}

@Component({
  selector: 'bui-s-dialog', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Dialog],
  template: `
    <button style="padding:8px 16px; border:none; border-radius:8px; background:var(--bw-button-danger-primary-fill); color:var(--bw-button-danger-primary-text); cursor:pointer" (click)="show.set(true)">Delete…</button>
    <bui-dialog [open]="show()" (openChange)="show.set($event)" title="Excluir item?" message="Esta ação não pode ser desfeita.">
      <div buiActions>
        <button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-secondary); cursor:pointer" (click)="show.set(false)">Cancel</button>
        <button style="padding:8px 16px; border:none; border-radius:8px; background:var(--bw-button-danger-primary-fill); color:var(--bw-button-danger-primary-text); cursor:pointer" (click)="show.set(false)">Delete</button>
      </div>
    </bui-dialog>
  `,
})
export class DialogScenario { protected readonly show = signal(false); }
