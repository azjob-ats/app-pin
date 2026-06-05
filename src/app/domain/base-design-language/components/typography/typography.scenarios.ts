import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BwTypography } from './typography.directive';

/** Scenarios portadas de `src/typography/__tests__/*.scenario.tsx`. */

const BODY =
  "Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center — an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.";
const TEXT = 'We ignite opportunity by setting the world in motion.';

// typography-display.scenario.tsx — 4 Display sizes, mesmo texto.
@Component({
  selector: 'bui-s-typo-display', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BwTypography],
  template: `<div>
    <div buiTypo="DisplayLarge">${TEXT}</div>
    <div buiTypo="DisplayMedium">${TEXT}</div>
    <div buiTypo="DisplaySmall">${TEXT}</div>
    <div buiTypo="DisplayXSmall">${TEXT}</div>
  </div>`,
})
export class DisplayScenario {}

// typography-heading.scenario.tsx — XSmall→XXLarge, prefixo do nome + texto. Tags h6→h1.
@Component({
  selector: 'bui-s-typo-heading', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BwTypography],
  template: `
    <h6 buiTypo="HeadingXSmall">HeadingXSmall - ${TEXT}</h6>
    <h5 buiTypo="HeadingSmall">HeadingSmall - ${TEXT}</h5>
    <h4 buiTypo="HeadingMedium">HeadingMedium - ${TEXT}</h4>
    <h3 buiTypo="HeadingLarge">HeadingLarge - ${TEXT}</h3>
    <h2 buiTypo="HeadingXLarge">HeadingXLarge - ${TEXT}</h2>
    <h1 buiTypo="HeadingXXLarge">HeadingXXLarge - ${TEXT}</h1>
  `,
})
export class HeadingScenario {}

// typography-body.scenario.tsx — Labels (div) intercalados com Paragraphs (p, corpo longo).
@Component({
  selector: 'bui-s-typo-body', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BwTypography],
  template: `
    <div buiTypo="LabelMedium">LabelMedium</div>
    <p buiTypo="ParagraphMedium">ParagraphMedium - ${BODY}</p>
    <div buiTypo="LabelLarge">LabelLarge</div>
    <p buiTypo="ParagraphLarge">ParagraphLarge - ${BODY}</p>
    <div buiTypo="LabelXSmall">LabelXSmall</div>
    <p buiTypo="ParagraphMedium">ParagraphMedium - ${BODY}</p>
    <p buiTypo="ParagraphXSmall">ParagraphXSmall</p>
    <p buiTypo="ParagraphLarge">ParagraphLarge - ${BODY}</p>
  `,
})
export class BodyScenario {}

// typography-mono.scenario.tsx — wrapper 800px; 2 linhas (paragraph/label, heading/display).
@Component({
  selector: 'bui-s-typo-mono', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BwTypography],
  styles: `.bui-s-mono > div > div > p:first-child { margin-block: 1em; }`,
  template: `<div class="bui-s-mono" style="width:800px;color:var(--bw-content-primary)">
    <div style="display:flex;justify-content:space-between">
      <div>
        <p>paragraph</p>
        <p buiTypo="MonoParagraphXSmall">$123,000</p>
        <p buiTypo="MonoParagraphSmall">$123,000</p>
        <p buiTypo="MonoParagraphMedium">$123,000</p>
        <p buiTypo="MonoParagraphLarge">$123,000</p>
      </div>
      <div>
        <p>label</p>
        <div buiTypo="MonoLabelXSmall">$123,000</div>
        <div buiTypo="MonoLabelSmall">$123,000</div>
        <div buiTypo="MonoLabelMedium">$123,000</div>
        <div buiTypo="MonoLabelLarge">$123,000</div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between">
      <div>
        <p>heading</p>
        <h6 buiTypo="MonoHeadingXSmall">$123,000</h6>
        <h5 buiTypo="MonoHeadingSmall">$123,000</h5>
        <h4 buiTypo="MonoHeadingMedium">$123,000</h4>
        <h3 buiTypo="MonoHeadingLarge">$123,000</h3>
        <h2 buiTypo="MonoHeadingXLarge">$123,000</h2>
        <h1 buiTypo="MonoHeadingXXLarge">$123,000</h1>
      </div>
      <div>
        <p>display</p>
        <div buiTypo="MonoDisplayXSmall">$123,000</div>
        <div buiTypo="MonoDisplaySmall">$123,000</div>
        <div buiTypo="MonoDisplayMedium">$123,000</div>
        <div buiTypo="MonoDisplayLarge">$123,000</div>
      </div>
    </div>
  </div>`,
})
export class MonoScenario {}

// typography-mono-styletron.scenario.tsx — mesmo resultado do Mono, porém montado pelo
// spread cru de `theme.typography.*` (sem o componente Block) → elementos SEM `data-baseweb`.
// Aqui aplicamos os tokens via `font` inline e restauramos as margens UA por tag (styles).
@Component({
  selector: 'bui-s-typo-mono-styletron', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [],
  styles: `
    .bui-s-mono-st h1 { margin-block: 0.67em; } .bui-s-mono-st h2 { margin-block: 0.83em; }
    .bui-s-mono-st h3 { margin-block: 1em; } .bui-s-mono-st h4 { margin-block: 1.33em; }
    .bui-s-mono-st h5 { margin-block: 1.67em; } .bui-s-mono-st h6 { margin-block: 2.33em; }
    .bui-s-mono-st p { margin-block: 1em; }
  `,
  template: `<div class="bui-s-mono-st" style="width:800px;color:var(--bw-content-primary)">
    <div style="display:flex;justify-content:space-between">
      <div>
        <p>paragraph</p>
        <p style="font:var(--bw-font-MonoParagraphXSmall)">$123,000</p>
        <p style="font:var(--bw-font-MonoParagraphSmall)">$123,000</p>
        <p style="font:var(--bw-font-MonoParagraphMedium)">$123,000</p>
        <p style="font:var(--bw-font-MonoParagraphLarge)">$123,000</p>
      </div>
      <div>
        <p>label</p>
        <div style="font:var(--bw-font-MonoLabelXSmall)">$123,000</div>
        <div style="font:var(--bw-font-MonoLabelSmall)">$123,000</div>
        <div style="font:var(--bw-font-MonoLabelMedium)">$123,000</div>
        <div style="font:var(--bw-font-MonoLabelLarge)">$123,000</div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between">
      <div>
        <p>heading</p>
        <h6 style="font:var(--bw-font-MonoHeadingXSmall)">$123,000</h6>
        <h5 style="font:var(--bw-font-MonoHeadingSmall)">$123,000</h5>
        <h4 style="font:var(--bw-font-MonoHeadingMedium)">$123,000</h4>
        <h3 style="font:var(--bw-font-MonoHeadingLarge)">$123,000</h3>
        <h2 style="font:var(--bw-font-MonoHeadingXLarge)">$123,000</h2>
        <h1 style="font:var(--bw-font-MonoHeadingXXLarge)">$123,000</h1>
      </div>
      <div>
        <p>display</p>
        <div style="font:var(--bw-font-MonoDisplayXSmall)">$123,000</div>
        <div style="font:var(--bw-font-MonoDisplaySmall)">$123,000</div>
        <div style="font:var(--bw-font-MonoDisplayMedium)">$123,000</div>
        <div style="font:var(--bw-font-MonoDisplayLarge)">$123,000</div>
      </div>
    </div>
  </div>`,
})
export class MonoStyletronScenario {}

// typography-overrides.scenario.tsx — DisplayLarge com override de cor (azul).
@Component({
  selector: 'bui-s-typo-overrides', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [BwTypography],
  template: `<div>
    <div buiTypo="DisplayLarge" colorOverride="blue">${TEXT}</div>
  </div>`,
})
export class OverridesScenario {}
