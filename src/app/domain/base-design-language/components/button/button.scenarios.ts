import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Button } from './button.component';
import { Kind } from './button.model';

/**
 * Scenarios portadas FIELMENTE de `src/button/__tests__/*.scenario.tsx` (Base Web).
 * Cada export = uma story do Ladle (id `button--<nome>`). Ícones React (ArrowRight…)
 * mapeados para Material Symbols. Enhancers funcionais (que trocam por estado) são
 * aproximados com o ícone do estado padrão.
 */
const ROW = `display:flex; gap:16px; flex-wrap:wrap; align-items:center;`;
const H = `
  .sc-h-md{font:var(--bw-font-HeadingMedium);color:var(--bw-content-primary);margin:0 0 8px;}
  .sc-h-xs{font:var(--bw-font-HeadingXSmall);color:var(--bw-content-primary);margin:24px 0 8px;}
  .sc-row{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin:16px 0;}
  .sc-matrix{display:grid;grid-template-columns:minmax(120px,1fr) repeat(5,minmax(160px,1fr));gap:12px;align-items:center;}
  .sc-matrix__h{font:var(--bw-font-LabelMedium);font-weight:600;text-align:center;color:var(--bw-content-primary);padding:8px;}
  .sc-matrix__k{font:var(--bw-font-LabelMedium);color:var(--bw-content-primary);padding:8px;}
  .sc-matrix__c{display:flex;justify-content:center;align-items:center;min-height:60px;}
`;
const KINDS: Kind[] = ['primary', 'secondary', 'tertiary', 'dangerPrimary', 'dangerSecondary', 'dangerTertiary'];

// ── button--button: matriz Kind × Estado (KIND + outline) ──
@Component({
  selector: 'bui-s-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `<div class="sc-matrix">
    <div class="sc-matrix__h">Kind</div><div class="sc-matrix__h">Default (Enabled, Hovered, Pressed)</div>
    <div class="sc-matrix__h">Selected</div><div class="sc-matrix__h">Loading</div>
    <div class="sc-matrix__h">Disabled</div><div class="sc-matrix__h">Disabled Loading</div>
    @for (k of kinds; track k) {
      <div class="sc-matrix__k">{{ k === 'outline' ? 'Button Group Exclusive: outline' : k }}</div>
      <div class="sc-matrix__c"><bui-button [kind]="k">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isSelected]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isLoading]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true" [isLoading]="true">Move</bui-button></div>
    }
  </div>`,
})
export class ButtonScenario {
  protected readonly kinds: Kind[] = [...KINDS, 'outline'];
}

// ── button--background-safe: matriz com backgroundSafe (KIND) ──
@Component({
  selector: 'bui-s-bg-safe', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `<div class="sc-matrix">
    <div class="sc-matrix__h">Kind</div><div class="sc-matrix__h">Default (Enabled, Hovered, Pressed)</div>
    <div class="sc-matrix__h">Selected</div><div class="sc-matrix__h">Loading</div>
    <div class="sc-matrix__h">Disabled</div><div class="sc-matrix__h">Disabled Loading</div>
    @for (k of kinds; track k) {
      <div class="sc-matrix__k">{{ k }}</div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [backgroundSafe]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isSelected]="true" [backgroundSafe]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isLoading]="true" [backgroundSafe]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true" [backgroundSafe]="true">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true" [isLoading]="true" [backgroundSafe]="true">Move</bui-button></div>
    }
  </div>`,
})
export class BackgroundSafeScenario {
  protected readonly kinds = KINDS;
}

// ── button--link: matriz como âncoras (href) ──
@Component({
  selector: 'bui-s-link', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `<div class="sc-matrix">
    <div class="sc-matrix__h">Kind</div><div class="sc-matrix__h">Default (Enabled, Hovered, Pressed)</div>
    <div class="sc-matrix__h">Selected</div><div class="sc-matrix__h">Loading</div>
    <div class="sc-matrix__h">Disabled</div><div class="sc-matrix__h">Disabled Loading</div>
    @for (k of kinds; track k) {
      <div class="sc-matrix__k">{{ k }}</div>
      <div class="sc-matrix__c"><bui-button [kind]="k" href="https://uber.com">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isSelected]="true" href="https://uber.com">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [isLoading]="true" href="https://uber.com">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true" href="https://uber.com">Move</bui-button></div>
      <div class="sc-matrix__c"><bui-button [kind]="k" [disabled]="true" [isLoading]="true" href="https://uber.com">Move</bui-button></div>
    }
  </div>`,
})
export class LinkScenario {
  protected readonly kinds = KINDS;
}

// ── button--colors: custom colors sobre containers coloridos ──
@Component({
  selector: 'bui-s-colors', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button],
  styles: `.sc-c{display:flex;align-items:center;padding:24px;margin-bottom:4px;}`,
  template: `
    <div class="sc-c" style="background:#276ef1"><bui-button shape="pill" [colors]="{ backgroundColor: '#1e54b7', color: 'white' }">Label</bui-button></div>
    <div class="sc-c" style="background:#eff3fe"><bui-button shape="pill" [colors]="{ backgroundColor: '#d4e2fc', color: 'black' }">Label</bui-button></div>
    <div class="sc-c" style="background:#048848"><bui-button shape="pill" [colors]="{ backgroundColor: '#03703c', color: 'white' }">Label</bui-button></div>
    <div class="sc-c" style="background:#e6f2ed"><bui-button shape="pill" [colors]="{ backgroundColor: '#addec9', color: 'black' }">Label</bui-button></div>
    <div class="sc-c" style="background:#ffc043"><bui-button shape="pill" [colors]="{ backgroundColor: '#ffe3ac', color: 'black' }">Label</bui-button></div>
    <div class="sc-c" style="background:#e11900"><bui-button shape="pill" [colors]="{ backgroundColor: '#ab1300', color: 'white' }">Label</bui-button></div>
    <div class="sc-c" style="background:#276ef1"><bui-button [disabled]="true" shape="pill" [colors]="{ backgroundColor: '#1e54b7', color: 'white' }">Disabled</bui-button></div>
  `,
})
export class ColorsScenario {}

// ── button--circle: kinds + sizes + ícone ──
@Component({
  selector: 'bui-s-circle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-row">
      <bui-button shape="circle" kind="primary">GM</bui-button>
      <bui-button shape="circle" kind="secondary">GM</bui-button>
      <bui-button shape="circle" kind="tertiary">GM</bui-button>
    </div>
    <div class="sc-row">
      <bui-button shape="circle" size="mini">GM</bui-button>
      <bui-button shape="circle" size="compact">GM</bui-button>
      <bui-button shape="circle" size="default">GM</bui-button>
      <bui-button shape="circle" size="large">GM</bui-button>
    </div>
    <div class="sc-row"><bui-button shape="circle"><span class="material-symbols-rounded">upload</span></bui-button></div>
  `,
})
export class CircleScenario {}

// ── button--a11y ──
@Component({
  selector: 'bui-s-a11y', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Button A11y</div>
    <div class="sc-h-xs">Text only button</div>
    <div class="sc-row"><bui-button>Edit</bui-button></div>
    <div class="sc-h-xs">Icon only button</div>
    <div class="sc-row"><bui-button shape="circle"><span class="material-symbols-rounded" aria-label="Next">arrow_forward</span></bui-button></div>
    <div class="sc-h-xs">Icon and text button</div>
    <div class="sc-row"><bui-button>
      <span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Notification
      <span buiEndEnhancer class="material-symbols-rounded">arrow_back</span>
    </bui-button></div>
    <div class="sc-h-xs">Toggle button</div>
    <div class="sc-row"><bui-button [isSelected]="selected" (buttonClick)="selected = !selected">Mute</bui-button></div>
  `,
})
export class A11yScenario { protected selected = false; }

// ── button--enhancers ──
@Component({
  selector: 'bui-s-enhancers', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Render Enhancers with different enhancer props</div>
    <div class="sc-h-xs">Enhancer with different sizes</div>
    @for (s of sizes; track s) {
      <div class="sc-row"><bui-button [size]="s">Notification<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button></div>
    }
    <div class="sc-h-xs">Start / end enhancers</div>
    @for (s of sizes; track s) {
      <div class="sc-row">
        <bui-button [size]="s">Primary</bui-button>
        <bui-button [size]="s"><span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Start</bui-button>
        <bui-button [size]="s">End<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button>
      </div>
    }
  `,
})
export class EnhancersScenario { protected readonly sizes = ['mini', 'compact', 'default', 'large'] as const; }

// ── button--enhancers-compact ──
@Component({
  selector: 'bui-s-enhancers-compact', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button],
  template: `<div style="display:flex;gap:4px;flex-wrap:wrap;">
    <bui-button size="compact">Primary</bui-button>
    <bui-button size="compact"><span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Start Enhancer</bui-button>
    <bui-button size="compact">End Enhancer<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button>
    <bui-button size="compact"><span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Both<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button>
  </div>`,
})
export class EnhancersCompactScenario {}

// ── button--enhancers-loading ──
@Component({
  selector: 'bui-s-enhancers-loading', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button],
  template: `<div style="display:flex;gap:4px;flex-wrap:wrap;">
    <bui-button [isLoading]="true">Primary</bui-button>
    <bui-button [isLoading]="true"><span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Start Enhancer</bui-button>
    <bui-button [isLoading]="true">End Enhancer<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button>
    <bui-button [isLoading]="true"><span buiStartEnhancer class="material-symbols-rounded">arrow_forward</span>Both<span buiEndEnhancer class="material-symbols-rounded">arrow_forward</span></bui-button>
  </div>`,
})
export class EnhancersLoadingScenario {}

// ── button--shapes ──
@Component({
  selector: 'bui-s-shapes', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Render Buttons with different shapes</div>
    <div class="sc-h-xs">shape: default(rectangular)</div>
    <div class="sc-row"><bui-button size="large">Default</bui-button><bui-button>Default</bui-button><bui-button size="compact">Default</bui-button></div>
    <div class="sc-h-xs">shape: pill(rounded)</div>
    <div class="sc-row">
      <bui-button shape="pill" size="large">Label</bui-button>
      <bui-button shape="pill" size="large"><span buiStartEnhancer class="material-symbols-rounded">upload</span>Label<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span></bui-button>
    </div>
    <div class="sc-row">
      <bui-button shape="pill">Label</bui-button>
      <bui-button shape="pill"><span buiStartEnhancer class="material-symbols-rounded">upload</span>Label<span buiEndEnhancer class="material-symbols-rounded">chevron_right</span></bui-button>
    </div>
    <div class="sc-h-xs">shape: circle / square</div>
    <div class="sc-row">
      <bui-button shape="circle"><span class="material-symbols-rounded">add</span></bui-button>
      <bui-button shape="square"><span class="material-symbols-rounded">add</span></bui-button>
    </div>
  `,
})
export class ShapesScenario {}

// ── button--sizes ──
@Component({
  selector: 'bui-s-sizes', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button],
  template: `<div style="${ROW}">
    <bui-button size="mini">Primary</bui-button><bui-button size="compact">Primary</bui-button>
    <bui-button size="default">Primary</bui-button><bui-button size="large">Primary</bui-button>
  </div>`,
})
export class SizesScenario {}

// ── button--sizes-loading ──
@Component({
  selector: 'bui-s-sizes-loading', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button],
  template: `<div style="${ROW}">
    <bui-button size="mini">Mini</bui-button><bui-button size="mini" [isLoading]="true">Mini</bui-button>
    <bui-button size="compact">Compact</bui-button><bui-button size="compact" [isLoading]="true">Compact</bui-button>
    <bui-button size="default">Default</bui-button><bui-button size="default" [isLoading]="true">Default</bui-button>
    <bui-button size="large">Large</bui-button><bui-button size="large" [isLoading]="true">Large</bui-button>
  </div>`,
})
export class SizesLoadingScenario {}

// ── button--width-types ──
@Component({
  selector: 'bui-s-width', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Render Buttons with different widthType props</div>
    <div class="sc-h-xs">width type: hug (default)</div>
    @for (s of sizes; track s) {
      <div class="sc-row"><bui-button [size]="s"><span buiStartEnhancer class="material-symbols-rounded">arrow_downward</span>Notification<span buiEndEnhancer class="material-symbols-rounded">arrow_upward</span></bui-button></div>
    }
    <div class="sc-h-xs">width type: fill (parent 300px)</div>
    <div style="width:300px;display:flex;flex-direction:column;gap:16px;">
      <bui-button [block]="true">Notification</bui-button>
      <bui-button [block]="true" kind="secondary">Notification</bui-button>
    </div>
  `,
})
export class WidthTypesScenario { protected readonly sizes = ['mini', 'compact', 'default', 'large'] as const; }

// ── button--min-hit-area ──
@Component({
  selector: 'bui-s-min-hit', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Button Min Hit Area Tests</div>
    <div class="sc-h-xs">Tap Min Hit Area (48px minimum)</div>
    <div class="sc-row">
      <bui-button size="mini" minHitArea="tap">Mini Tap</bui-button>
      <bui-button size="compact" minHitArea="tap">Compact Tap</bui-button>
      <bui-button size="default" minHitArea="tap">Default Tap</bui-button>
      <bui-button size="large" minHitArea="tap">Large Tap</bui-button>
    </div>
    <div class="sc-h-xs">Click Min Hit Area (28px minimum)</div>
    <div class="sc-row">
      <bui-button size="mini" minHitArea="click">Mini Click</bui-button>
      <bui-button size="compact" minHitArea="click">Compact Click</bui-button>
    </div>
  `,
})
export class MinHitAreaScenario {}

// ── button--functional-children (aproximação: render-props não existem em Angular) ──
@Component({
  selector: 'bui-s-fn-children', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Button], styles: H,
  template: `
    <div class="sc-h-md">Button with Functional Children</div>
    <div class="sc-h-xs">Dynamic Text Labels Based on Button State (aproximado)</div>
    <div class="sc-row"><bui-button kind="secondary">💤 Default</bui-button></div>
    <div class="sc-h-xs">Icon-Only Buttons with State-Based Icons (aproximado)</div>
    <div class="sc-row"><bui-button shape="square" kind="secondary"><span class="material-symbols-rounded">arrow_forward</span></bui-button></div>
  `,
})
export class FunctionalChildrenScenario {}
