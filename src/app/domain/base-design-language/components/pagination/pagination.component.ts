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
    <div class="bui-pg" data-baseweb="pagination">
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
    .bui-pg__max { margin:0 var(--bw-sizing-scale600) 0 var(--bw-sizing-scale300); white-space:nowrap; }
    .bui-pg .material-symbols-rounded { font-size:24px; }
  `,
})
export class Pagination {
  readonly numPages = input<number>(5);
  readonly current = model<number>(1);
  readonly size = input<'default' | 'compact' | 'mini'>('compact');
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
  template: `<div style="min-height:280px;"><bui-pagination [numPages]="4" [current]="1" /></div>`,
})
export class PaginationScenario {}
