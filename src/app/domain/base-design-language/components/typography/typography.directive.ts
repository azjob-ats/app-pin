import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, computed, input } from '@angular/core';

export type FontScale =
  | 'DisplayLarge' | 'DisplayMedium' | 'DisplaySmall' | 'DisplayXSmall'
  | 'HeadingXXLarge' | 'HeadingXLarge' | 'HeadingLarge' | 'HeadingMedium' | 'HeadingSmall' | 'HeadingXSmall'
  | 'LabelLarge' | 'LabelMedium' | 'LabelSmall' | 'LabelXSmall'
  | 'ParagraphLarge' | 'ParagraphMedium' | 'ParagraphSmall' | 'ParagraphXSmall';

/** Typography — aplica uma escala do Base Web a qualquer elemento. Uso: `<p buiFont="ParagraphMedium">`. */
@Directive({
  selector: '[buiFont]',
  host: { '[style.font]': 'font()' },
})
export class BuiFont {
  readonly buiFont = input.required<FontScale>();
  protected readonly font = computed(() => `var(--bw-font-${this.buiFont()})`);
}

@Component({
  selector: 'bui-s-typography', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BuiFont],
  template: `<div style="display:flex; flex-direction:column; gap:8px; color:var(--bw-content-primary)">
    <span buiFont="DisplayMedium">Display Medium</span>
    <span buiFont="HeadingLarge">Heading Large</span>
    <span buiFont="LabelMedium">Label Medium</span>
    <span buiFont="ParagraphMedium">Paragraph Medium — corpo de texto padrão do sistema.</span>
    <span buiFont="ParagraphSmall">Paragraph Small</span>
  </div>`,
})
export class TypographyScenario {}
