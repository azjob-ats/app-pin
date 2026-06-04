import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export interface Crumb { label: string; href?: string; }

/** Breadcrumbs — fiel ao baseui/breadcrumbs (links + separador). */
@Component({
  selector: 'bui-breadcrumbs',
  exportAs: 'buiBreadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="bui-bc" aria-label="Breadcrumb">
      @for (c of items(); track $index; let last = $last) {
        @if (c.href && !last) {
          <a class="bui-bc__link" [href]="c.href">{{ c.label }}</a>
        } @else {
          <span class="bui-bc__current" [attr.aria-current]="last ? 'page' : null">{{ c.label }}</span>
        }
        @if (!last) { <span class="bui-bc__sep" aria-hidden="true">/</span> }
      }
    </nav>
  `,
  styles: `
    .bui-bc { display:flex; align-items:center; gap:var(--bw-sizing-scale300); font:var(--bw-font-ParagraphSmall); }
    .bui-bc__link { color:var(--bw-content-secondary); text-decoration:none; &:hover { color:var(--bw-content-primary); text-decoration:underline; } }
    .bui-bc__current { color:var(--bw-content-primary); }
    .bui-bc__sep { color:var(--bw-content-tertiary); }
  `,
})
export class Breadcrumbs {
  readonly items = input.required<Crumb[]>();
}

@Component({
  selector: 'bui-s-breadcrumbs', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Breadcrumbs],
  template: `<bui-breadcrumbs [items]="[{label:'Home',href:'#'},{label:'Components',href:'#'},{label:'Breadcrumbs'}]" />`,
})
export class BreadcrumbsScenario {}
