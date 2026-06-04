import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** EmptyState — fiel ao baseui (ícone + título + descrição + ação). */
@Component({
  selector: 'bui-empty-state',
  exportAs: 'buiEmptyState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="material-symbols-rounded bui-empty__icon">{{ icon() }}</span>
    <div class="bui-empty__title">{{ title() }}</div>
    @if (description()) { <div class="bui-empty__desc">{{ description() }}</div> }
    <div class="bui-empty__action"><ng-content /></div>
  `,
  styles: `
    bui-empty-state { display:flex; flex-direction:column; align-items:center; text-align:center; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale1200); }
    .bui-empty__icon { font-size:40px; color:var(--bw-content-tertiary); }
    .bui-empty__title { font:var(--bw-font-HeadingSmall); color:var(--bw-content-primary); }
    .bui-empty__desc { max-width:42ch; font:var(--bw-font-ParagraphMedium); color:var(--bw-content-secondary); }
    .bui-empty__action:empty { display:none; }
  `,
})
export class EmptyState {
  readonly icon = input<string>('inbox');
  readonly title = input.required<string>();
  readonly description = input<string>('');
}

@Component({
  selector: 'bui-s-empty-state', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [EmptyState],
  template: `<div style="width:480px; border:1px solid var(--bw-border-opaque); border-radius:8px;">
    <bui-empty-state icon="search_off" title="Nenhum resultado" description="Tente ajustar os filtros ou a busca." />
  </div>`,
})
export class EmptyStateScenario {}
