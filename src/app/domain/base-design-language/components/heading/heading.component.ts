import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Heading — fiel ao baseui/heading (styleLevel → escala Heading*). */
@Component({
  selector: 'bui-heading',
  exportAs: 'buiHeading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-heading { display:block; margin:0; color:var(--bw-content-primary); }`,
  host: { '[attr.role]': '"heading"', '[attr.aria-level]': 'level()', '[style.font]': 'font()' },
})
export class Heading {
  readonly level = input<HeadingLevel>(1);
  readonly styleLevel = input<HeadingLevel | null>(null);

  private readonly scales: Record<HeadingLevel, string> = {
    1: 'HeadingXXLarge',
    2: 'HeadingXLarge',
    3: 'HeadingLarge',
    4: 'HeadingMedium',
    5: 'HeadingSmall',
    6: 'HeadingXSmall',
  };
  protected readonly font = computed(() => `var(--bw-font-${this.scales[this.styleLevel() ?? this.level()]})`);
}

@Component({
  selector: 'bui-s-heading', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Heading],
  template: `<div style="display:flex; flex-direction:column; gap:12px;">
    <bui-heading [level]="1">Heading level 1</bui-heading>
    <bui-heading [level]="2">Heading level 2</bui-heading>
    <bui-heading [level]="3">Heading level 3</bui-heading>
    <bui-heading [level]="4">Heading level 4</bui-heading>
    <bui-heading [level]="5">Heading level 5</bui-heading>
    <bui-heading [level]="6">Heading level 6</bui-heading>
  </div>`,
})
export class HeadingScenario {}
