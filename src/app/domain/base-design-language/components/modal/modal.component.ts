import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, signal } from '@angular/core';

/** Modal — fiel ao baseui/modal (dialog centralizado + backdrop; size; Esc/backdrop fecham). */
@Component({
  selector: 'bui-modal',
  exportAs: 'buiModal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="bui-modal__backdrop" (click)="open.set(false)"></div>
      <div class="bui-modal__dialog" [attr.data-size]="size()" role="dialog" aria-modal="true">
        @if (title() || closeable()) {
          <div class="bui-modal__header">
            <span class="bui-modal__title">{{ title() }}</span>
            @if (closeable()) { <button type="button" class="bui-modal__close" aria-label="Close" (click)="open.set(false)"><span class="material-symbols-rounded">close</span></button> }
          </div>
        }
        <div class="bui-modal__body"><ng-content /></div>
        <div class="bui-modal__footer"><ng-content select="[buiFooter]" /></div>
      </div>
    }
  `,
  styles: `
    .bui-modal__backdrop { position:fixed; inset:0; z-index:var(--bw-z-modal); background:var(--bw-background-overlay); }
    .bui-modal__dialog { position:fixed; z-index:calc(var(--bw-z-modal) + 1); top:50%; left:50%; transform:translate(-50%,-50%); width:min(560px, 92vw); max-height:86vh; overflow:auto; display:flex; flex-direction:column; gap:var(--bw-sizing-scale600); padding:var(--bw-sizing-scale800); border-radius:var(--bw-radius-300); background:var(--bw-background-primary); box-shadow:var(--bw-shadow-700); }
    .bui-modal__dialog[data-size="full"] { width:96vw; height:92vh; }
    .bui-modal__dialog[data-size="auto"] { width:auto; }
    .bui-modal__header { display:flex; align-items:center; justify-content:space-between; }
    .bui-modal__title { font:var(--bw-font-HeadingSmall); color:var(--bw-content-primary); }
    .bui-modal__close { border:none; background:transparent; color:var(--bw-content-secondary); cursor:pointer; line-height:0; span { font-size:22px; } }
    .bui-modal__body { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-secondary); }
    .bui-modal__footer { display:flex; justify-content:flex-end; gap:var(--bw-sizing-scale400); &:empty { display:none; } }
  `,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Modal {
  readonly open = model(false);
  readonly title = input<string>('');
  readonly size = input<'default' | 'full' | 'auto'>('default');
  readonly closeable = input(true);
}

@Component({
  selector: 'bui-s-modal', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Modal],
  template: `
    <button style="padding:8px 16px; border:none; border-radius:8px; background:var(--bw-button-primary-fill); color:var(--bw-button-primary-text); cursor:pointer" (click)="show.set(true)">Open modal</button>
    <bui-modal [open]="show()" (openChange)="show.set($event)" title="Modal title">
      Conteúdo do modal com uma mensagem de exemplo.
      <div buiFooter>
        <button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-secondary); cursor:pointer" (click)="show.set(false)">Cancel</button>
        <button style="padding:8px 16px; border:none; border-radius:8px; background:var(--bw-button-primary-fill); color:var(--bw-button-primary-text); cursor:pointer" (click)="show.set(false)">Confirm</button>
      </div>
    </bui-modal>
  `,
})
export class ModalScenario { protected readonly show = signal(false); }
