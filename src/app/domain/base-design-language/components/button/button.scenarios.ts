import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Button } from './button.component';
import { Kind } from './button.model';
import {
  BuiArrowDown,
  BuiArrowRight,
  BuiArrowUp,
  BuiChevronRight,
  BuiUpload,
} from '../icon/icon.component';

/** Scenarios portadas de `src/button/__tests__/*.scenario.tsx`. */

const KINDS: Kind[] = ['primary', 'secondary', 'tertiary', 'dangerPrimary', 'dangerSecondary', 'dangerTertiary', 'outline'];
const GRID = 'display:grid;grid-template-columns:minmax(120px,1fr) repeat(5,minmax(180px,1fr));gap:12px;align-items:center;padding:10px';
const HEAD = 'font:var(--bw-font-LabelMedium);font-weight:600;padding:8px;text-align:center;color:var(--bw-content-primary)';
const KCELL = 'font:var(--bw-font-LabelMedium);padding:8px;text-align:left;color:var(--bw-content-primary)';
const BCELL = 'display:flex;justify-content:center;align-items:center;padding:8px;min-height:60px';

// button.scenario.tsx — grade: cada kind × default/selected/loading/disabled/disabled-loading.
@Component({
  selector: 'bui-s-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <div style="${GRID}">
      <div style="${HEAD}">Kind</div>
      <div style="${HEAD}">Default</div>
      <div style="${HEAD}">Selected</div>
      <div style="${HEAD}">Loading</div>
      <div style="${HEAD}">Disabled</div>
      <div style="${HEAD}">Disabled Loading</div>
      @for (k of kinds; track k) {
        <div style="${KCELL}">{{ k }}</div>
        <div style="${BCELL}"><bui-button [kind]="k">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [isSelected]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [isLoading]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [disabled]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [disabled]="true" [isLoading]="true">Move</bui-button></div>
      }
    </div>
  `,
})
export class ButtonScenario {
  protected readonly kinds = KINDS;
}

// button-sizes.scenario.tsx — mini/compact/default/large (primary).
@Component({
  selector: 'bui-s-button-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `<div style="display:flex;align-items:center;gap:4px">
    <bui-button size="mini">Primary</bui-button>
    <bui-button size="compact">Primary</bui-button>
    <bui-button size="default">Primary</bui-button>
    <bui-button size="large">Primary</bui-button>
  </div>`,
})
export class ButtonSizesScenario {}

// button-sizes-loading.scenario.tsx — pares (normal + loading) por size.
@Component({
  selector: 'bui-s-button-sizes-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `<div style="display:flex;align-items:center;gap:4px">
    <bui-button size="mini">Mini</bui-button><bui-button size="mini" [isLoading]="true">Mini</bui-button>
    <bui-button size="compact">Compact</bui-button><bui-button size="compact" [isLoading]="true">Compact</bui-button>
    <bui-button size="default">Default</bui-button><bui-button size="default" [isLoading]="true">Default</bui-button>
    <bui-button size="large">Large</bui-button><bui-button size="large" [isLoading]="true">Large</bui-button>
  </div>`,
})
export class ButtonSizesLoadingScenario {}

// button-shapes.scenario.tsx — default / pill (com enhancers) em vários sizes.
@Component({
  selector: 'bui-s-button-shapes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiUpload, BuiChevronRight],
  template: `
    <h4 style="margin:0 0 8px">shape: default(rectangular)</h4>
    <div style="display:flex;gap:10px;align-items:center;margin:10px 0">
      <bui-button size="large">Default</bui-button>
      <bui-button>Default</bui-button>
      <bui-button size="compact">Default</bui-button>
    </div>
    <h4 style="margin:0 0 8px">shape: pill(rounded)</h4>
    <div style="display:flex;gap:10px;align-items:center;margin:10px 0">
      <bui-button shape="pill" size="large">Label</bui-button>
      <bui-button shape="pill" size="large">
        <bui-upload buiStartEnhancer [size]="24" />Label<bui-chevron-right buiEndEnhancer [size]="24" />
      </bui-button>
    </div>
  `,
})
export class ButtonShapesScenario {}

// button-colors.scenario.tsx — colors customizadas sobre fundos.
@Component({
  selector: 'bui-s-button-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <div style="background:#276ef1;padding:16px"><bui-button shape="pill" [colors]="{backgroundColor:'#1e54b7',color:'white'}">Label</bui-button></div>
    <div style="background:#048848;padding:16px"><bui-button shape="pill" [colors]="{backgroundColor:'#03703c',color:'white'}">Label</bui-button></div>
    <div style="background:#ffc043;padding:16px"><bui-button shape="pill" [colors]="{backgroundColor:'#ffe3ac',color:'black'}">Label</bui-button></div>
    <div style="background:#e11900;padding:16px"><bui-button shape="pill" [colors]="{backgroundColor:'#ab1300',color:'white'}">Label</bui-button></div>
  `,
})
export class ButtonColorsScenario {}

// button-circle.scenario.tsx — circle por kind, por size, e com ícone.
@Component({
  selector: 'bui-s-button-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiUpload],
  template: `
    <div style="display:flex;gap:10px">
      <bui-button shape="circle" kind="primary">GM</bui-button>
      <bui-button shape="circle" kind="secondary">GM</bui-button>
      <bui-button shape="circle" kind="tertiary">GM</bui-button>
    </div>
    <br />
    <div style="display:flex;gap:10px;align-items:center">
      <bui-button shape="circle" size="mini">GM</bui-button>
      <bui-button shape="circle" size="compact">GM</bui-button>
      <bui-button shape="circle" size="default">GM</bui-button>
      <bui-button shape="circle" size="large">GM</bui-button>
    </div>
    <br />
    <div><bui-button shape="circle"><bui-upload [size]="24" /></bui-button></div>
  `,
})
export class ButtonCircleScenario {}

// button-enhancers.scenario.tsx — start/end enhancers (subset: element type por size).
@Component({
  selector: 'bui-s-button-enhancers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiArrowRight],
  template: `
    @for (s of sizes; track s.size) {
      <div style="display:flex;margin:16px 0;gap:16px;align-items:center">
        <bui-button [size]="s.size">Primary</bui-button>
        <bui-button [size]="s.size"><bui-arrow-right buiStartEnhancer [size]="s.art" />Start Enhancer</bui-button>
        <bui-button [size]="s.size"><bui-arrow-right buiEndEnhancer [size]="s.art" />End Enhancer</bui-button>
      </div>
    }
  `,
})
export class ButtonEnhancersScenario {
  protected readonly sizes = [
    { size: 'mini' as const, art: 12 },
    { size: 'compact' as const, art: 16 },
    { size: 'default' as const, art: 20 },
    { size: 'large' as const, art: 24 },
  ];
}

// button-enhancers-compact.scenario.tsx — compact com enhancers.
@Component({
  selector: 'bui-s-button-enhancers-compact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiArrowRight],
  template: `<div style="display:flex;gap:4px">
    <bui-button size="compact">Primary</bui-button>
    <bui-button size="compact"><bui-arrow-right buiStartEnhancer [size]="16" />Start Enhancer</bui-button>
    <bui-button size="compact"><bui-arrow-right buiEndEnhancer [size]="16" />End Enhancer</bui-button>
    <bui-button size="compact"><bui-arrow-right buiStartEnhancer [size]="16" />Both<bui-arrow-right buiEndEnhancer [size]="16" /></bui-button>
  </div>`,
})
export class ButtonEnhancersCompactScenario {}

// button-enhancers-loading.scenario.tsx — loading com enhancers.
@Component({
  selector: 'bui-s-button-enhancers-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiArrowRight],
  template: `<div style="display:flex;gap:4px">
    <bui-button [isLoading]="true">Primary</bui-button>
    <bui-button [isLoading]="true"><bui-arrow-right buiStartEnhancer [size]="20" />Start Enhancer</bui-button>
    <bui-button [isLoading]="true"><bui-arrow-right buiEndEnhancer [size]="20" />End Enhancer</bui-button>
    <bui-button [isLoading]="true"><bui-arrow-right buiStartEnhancer [size]="20" />Both<bui-arrow-right buiEndEnhancer [size]="20" /></bui-button>
  </div>`,
})
export class ButtonEnhancersLoadingScenario {}

// button-width-type.scenario.tsx — hug (default) e fill (300px) com enhancers, por size.
@Component({
  selector: 'bui-s-button-width-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiArrowUp, BuiArrowDown],
  template: `
    <h4 style="margin:0 0 8px">width type: hug(default)</h4>
    @for (s of sizes; track s.size) {
      <div style="margin:16px 0">
        <bui-button [size]="s.size"><bui-arrow-down buiStartEnhancer [size]="s.art" />Notification<bui-arrow-up buiEndEnhancer [size]="s.art" /></bui-button>
      </div>
    }
    <h4 style="margin:0 0 8px">width type: fill (300px)</h4>
    @for (s of sizes; track s.size) {
      <div style="margin:16px 0;width:300px">
        <bui-button [block]="true" [size]="s.size"><bui-arrow-down buiStartEnhancer [size]="s.art" />Notification<bui-arrow-up buiEndEnhancer [size]="s.art" /></bui-button>
      </div>
    }
  `,
})
export class ButtonWidthTypeScenario {
  protected readonly sizes = [
    { size: 'mini' as const, art: 12 },
    { size: 'compact' as const, art: 16 },
    { size: 'default' as const, art: 20 },
    { size: 'large' as const, art: 24 },
  ];
}

// link-buttons.scenario.tsx — grade com href (âncora) por kind.
@Component({
  selector: 'bui-s-button-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <div style="${GRID}">
      <div style="${HEAD}">Kind</div>
      <div style="${HEAD}">Default</div>
      <div style="${HEAD}">Selected</div>
      <div style="${HEAD}">Loading</div>
      <div style="${HEAD}">Disabled</div>
      <div style="${HEAD}">Disabled Loading</div>
      @for (k of kinds; track k) {
        <div style="${KCELL}">{{ k }}</div>
        <div style="${BCELL}"><bui-button href="#" [kind]="k">Move</bui-button></div>
        <div style="${BCELL}"><bui-button href="#" [kind]="k" [isSelected]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button href="#" [kind]="k" [isLoading]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button href="#" [kind]="k" [disabled]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button href="#" [kind]="k" [disabled]="true" [isLoading]="true">Move</bui-button></div>
      }
    </div>
  `,
})
export class ButtonLinkScenario {
  protected readonly kinds = KINDS;
}

// button-backgroundsafe.scenario.tsx — grade backgroundSafe por kind (sobre fundo).
@Component({
  selector: 'bui-s-button-background-safe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <div style="${GRID}">
      <div style="${HEAD}">Kind</div><div style="${HEAD}">Default</div><div style="${HEAD}">Selected</div>
      <div style="${HEAD}">Loading</div><div style="${HEAD}">Disabled</div><div style="${HEAD}">Disabled Loading</div>
      @for (k of kinds; track k) {
        <div style="${KCELL}">{{ k }}</div>
        <div style="${BCELL}"><bui-button [kind]="k" [backgroundSafe]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [backgroundSafe]="true" [isSelected]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [backgroundSafe]="true" [isLoading]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [backgroundSafe]="true" [disabled]="true">Move</bui-button></div>
        <div style="${BCELL}"><bui-button [kind]="k" [backgroundSafe]="true" [disabled]="true" [isLoading]="true">Move</bui-button></div>
      }
    </div>
  `,
})
export class ButtonBackgroundSafeScenario {
  protected readonly kinds = KINDS;
}

// button-min-hit-area.scenario.tsx — tap (área 48px) por size.
@Component({
  selector: 'bui-s-button-min-hit-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <h4 style="margin:0 0 8px">Tap Min Hit Area (48px)</h4>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <bui-button size="mini" minHitArea="tap">Mini Tap</bui-button>
      <bui-button size="compact" minHitArea="tap">Compact Tap</bui-button>
      <bui-button size="default" minHitArea="tap">Default Tap</bui-button>
    </div>
  `,
})
export class ButtonMinHitAreaScenario {}

// button-a11y.scenario.tsx — texto / ícone (circle, aria-label) / ícone+texto.
@Component({
  selector: 'bui-s-button-a11y',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiArrowRight],
  template: `
    <div style="margin:16px 0"><bui-button>Edit</bui-button></div>
    <div style="margin:16px 0"><bui-button shape="circle"><bui-arrow-right /></bui-button></div>
    <div style="margin:16px 0"><bui-button>Notification<bui-arrow-right buiEndEnhancer [size]="20" /></bui-button></div>
  `,
})
export class ButtonA11yScenario {}
