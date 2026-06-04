import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Icon — usa a fonte Material Symbols (já carregada). `name` = glyph; cor por currentColor. */
@Component({
  selector: 'bui-icon',
  exportAs: 'buiIcon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<span class="material-symbols-rounded" [attr.aria-hidden]="title() ? null : 'true'" [attr.role]="title() ? 'img' : null" [attr.aria-label]="title() || null">{{ name() }}</span>`,
  styles: `
    bui-icon { display:inline-flex; align-items:center; justify-content:center; width:var(--bui-icon-size,24px); height:var(--bui-icon-size,24px); color:inherit; }
    bui-icon .material-symbols-rounded { font-size:var(--bui-icon-size,24px); line-height:1; }
  `,
  host: { '[style.--bui-icon-size.px]': 'size()' },
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input<number>(24);
  readonly title = input<string>('');
}

@Component({
  selector: 'bui-s-icon', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Icon],
  template: `<div style="display:flex; gap:16px; align-items:center; color:var(--bw-content-primary)">
    <bui-icon name="search" /><bui-icon name="favorite" [size]="32" /><bui-icon name="settings" [size]="40" /><bui-icon name="check_circle" [size]="24" title="ok" />
  </div>`,
})
export class IconScenario {}
