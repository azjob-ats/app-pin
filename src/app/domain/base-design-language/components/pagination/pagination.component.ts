import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button.component';
import { Select, Option } from '../select/select.component';

/**
 * Pagination — fiel ao baseui/pagination.
 * Estrutura: [◁ Prev] · <Select página> · "of N" · [Next ▷], com botões tertiary.
 */
@Component({
  selector: 'bui-pagination',
  exportAs: 'buiPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, Button, Select],
  template: `
    <div class="bui-pg bui-pg--{{ size() }}" data-baseweb="pagination">
      <bui-button
        kind="tertiary"
        [size]="size()"
        [disabled]="current() <= 1"
        [attr.aria-label]="'previous page. current page ' + current() + ' of ' + numPages()"
        (buttonClick)="go(current() - 1)"
      >
        <span buiStartEnhancer class="material-symbols-rounded">chevron_left</span>{{ prevLabel() }}
      </bui-button>

      <div class="bui-pg__dropdown">
        <bui-select
          [options]="options()"
          [ngModel]="String(current())"
          (ngModelChange)="go(+$event)"
          [attr.aria-label]="'page ' + current() + ' of ' + numPages()"
        />
      </div>

      <span class="bui-pg__max" aria-hidden="true">{{ preposition() }} {{ numPages() }}</span>

      <bui-button
        kind="tertiary"
        [size]="size()"
        [disabled]="current() >= numPages()"
        [attr.aria-label]="'next page. current page ' + current() + ' of ' + numPages()"
        (buttonClick)="go(current() + 1)"
      >
        {{ nextLabel() }}<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span>
      </bui-button>
    </div>
  `,
  styles: `
    .bui-pg { display:flex; align-items:center; font:var(--bw-font-LabelMedium); color:var(--bw-background-inverse-primary, var(--bw-content-primary)); }
    .bui-pg__dropdown { margin:0 var(--bw-sizing-scale300) 0 var(--bw-sizing-scale600); }
    .bui-pg__dropdown bui-select .bui-select__control { min-width:0; }
    /* Select da paginação é tertiary: fundo transparente, cinza só no hover/open, sem borda; seta escura. */
    .bui-pg__dropdown .bui-select__control { background:transparent; color:var(--bw-button-tertiary-text); box-shadow:none; }
    .bui-pg__dropdown .bui-select__control:hover:not(:disabled) { background:transparent; box-shadow:inset 999px 999px 0 var(--bw-overlay-hover); }
    .bui-pg__dropdown .bui-select__control[data-open] { background:transparent; box-shadow:inset 999px 999px 0 var(--bw-overlay-hover); }
    .bui-pg__dropdown .bui-select__arrow { color:var(--bw-button-tertiary-text); }
    /* Select control acompanha a altura do size (fiel ao baseui: mini 32 / compact 36 / default 48 / large 60). */
    .bui-pg--mini    .bui-pg__dropdown .bui-select__control { min-height:32px; }
    .bui-pg--compact .bui-pg__dropdown .bui-select__control { min-height:36px; }
    .bui-pg--default .bui-pg__dropdown .bui-select__control { min-height:48px; }
    .bui-pg--large   .bui-pg__dropdown .bui-select__control { min-height:60px; }
    .bui-pg__max { margin:0 var(--bw-sizing-scale600) 0 var(--bw-sizing-scale300); white-space:nowrap; }
    .bui-pg .material-symbols-rounded { font-size:24px; }
  `,
})
export class Pagination {
  readonly numPages = input<number>(5);
  readonly current = model<number>(1);
  readonly size = input<'mini' | 'compact' | 'default' | 'large'>('default');
  readonly prevLabel = input<string>('Prev');
  readonly nextLabel = input<string>('Next');
  readonly preposition = input<string>('of');

  protected readonly String = String;
  protected readonly options = computed<Option[]>(() =>
    Array.from({ length: this.numPages() }, (_, i) => ({ id: `${i + 1}`, label: `${i + 1}` }))
  );

  protected go(p: number): void {
    if (Number.isFinite(p) && p >= 1 && p <= this.numPages()) this.current.set(p);
  }
}

@Component({
  selector: 'bui-s-pagination', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Pagination],
  // Clone fiel da pagination.scenario.tsx: mini / compact / default / large, todas numPages=10.
  template: `
    <bui-pagination size="mini" [numPages]="10" [current]="1" />
    <bui-pagination size="compact" [numPages]="10" [current]="1" />
    <bui-pagination size="default" [numPages]="10" [current]="1" />
    <bui-pagination size="large" [numPages]="10" [current]="1" />
  `,
})
export class PaginationScenario {}
