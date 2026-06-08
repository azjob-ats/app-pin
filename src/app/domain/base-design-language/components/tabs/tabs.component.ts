import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  contentChildren,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Tab — item de um `bui-tabs`. `title` é o rótulo do link; o conteúdo projetado vira o
 * painel. Não renderiza box próprio: o `bui-tabs` lê os filhos (contentChildren) e estampa
 * o painel via `ngTemplateOutlet`.
 */
@Component({
  selector: 'bui-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-template #content><ng-content /></ng-template>',
})
export class BuiTab {
  /** Rótulo do link da aba. */
  readonly title = input('');
  /** Desabilita a aba. */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}

/**
 * Tabs — clone fiel do `baseui/tabs`. Barra de abas (`role=tablist`) + painéis
 * (`role=tabpanel`). Controla a aba ativa por índice (`activeKey`), controlado ou stateful.
 * Só o painel ativo é exibido (`display:block`); o ativo ganha a borda inferior `borderSelected`.
 */
@Component({
  selector: 'bui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  styleUrl: './tabs.component.scss',
  template: `
    <div class="bui-tabs__bar" role="tablist">
      @for (t of tabs(); track $index) {
        <div
          class="bui-tabs__tab"
          role="tab"
          [id]="$index"
          [class.bui-tabs__tab--active]="key($index) === activeKeyState()"
          [class.bui-tabs__tab--disabled]="t.disabled()"
          [attr.tabindex]="t.disabled() ? -1 : 0"
          [attr.aria-selected]="key($index) === activeKeyState()"
          [attr.aria-disabled]="t.disabled() || null"
          (click)="select($index, t.disabled())"
          (keydown)="onKey($event, $index, t.disabled())"
        >
          {{ t.title() }}
        </div>
      }
    </div>
    @for (t of tabs(); track $index) {
      <div
        class="bui-tabs__content"
        role="tabpanel"
        [attr.aria-labelledby]="$index"
        [class.bui-tabs__content--active]="key($index) === activeKeyState()"
      >
        @if (key($index) === activeKeyState()) {
          <ng-container [ngTemplateOutlet]="t.content()" />
        }
      </div>
    }
  `,
  host: {
    'data-baseweb': 'tabs',
    class: 'bui-tabs',
  },
})
export class BuiTabs {
  /** Chave (índice em string) da aba ativa. Omitido → stateful (default `'0'`). */
  readonly activeKey = input<string>();
  readonly activeKeyChange = output<string>();

  protected readonly tabs = contentChildren(BuiTab);
  protected readonly activeKeyState = linkedSignal(() => this.activeKey() ?? '0');

  protected key(i: number): string {
    return String(i);
  }

  protected select(i: number, disabled: boolean): void {
    if (disabled) return;
    this.activeKeyState.set(this.key(i));
    this.activeKeyChange.emit(this.key(i));
  }

  protected onKey(e: KeyboardEvent, i: number, disabled: boolean): void {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      this.select(i, disabled);
    }
  }
}
