import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiCheck, BuiDelete, BuiIcon, BuiPlus, BuiUpload } from './icon.component';
import { Button } from '../button/button.component';

/** Scenarios portadas de `src/icon/__tests__/*.scenario.tsx` (a `buttons` depende de Button → adiada). */

// icon-attributes.scenario.tsx — resultado visual: 3 Checks (100px, red) + 1 triângulo (100px, red).
// (No original os 3 Checks são iguais — testam size/$size/override; o 4º é o Upload "tematizado" p/ triângulo.)
@Component({
  selector: 'bui-s-icon-attributes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCheck, BuiIcon],
  template: `
    <bui-check [size]="100" color="red" />
    <bui-check [size]="100" color="red" />
    <bui-check [size]="100" color="red" />
    <bui-icon d="M20 19L12 5L4 19H20Z" [size]="100" color="red" title="Triangle" />
  `,
})
export class IconAttributesScenario {}

// icon-overrides.scenario.tsx — X rosa (order:1, após "Stuff") num flex + Plus 54px abaixo.
@Component({
  selector: 'bui-s-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDelete, BuiPlus],
  template: `
    <div>
      <div style="display:flex">
        <span style="order:1"><bui-delete color="pink" /></span>
        Stuff
      </div>
      <div>
        <bui-plus size="54px" />
      </div>
    </div>
  `,
})
export class IconOverridesScenario {}

// icon-buttons.scenario.tsx — ícone como enhancer do Button (+ string/node/number/array).
@Component({
  selector: 'bui-s-icon-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, BuiUpload],
  template: `
    <div>
      <bui-button><bui-upload buiStartEnhancer [size]="20" />Start Enhancer</bui-button>
      <br /><br />
      <bui-button><span buiStartEnhancer>hello</span>Start Enhancer</bui-button>
      <br /><br />
      <bui-button><span buiStartEnhancer>fn</span>Start Enhancer</bui-button>
      <br /><br />
      <bui-button><span buiStartEnhancer>node</span>Start Enhancer</bui-button>
      <br /><br />
      <bui-button>End Enhancer<bui-upload buiEndEnhancer [size]="20" /></bui-button>
      <br /><br />
      <bui-button>End Enhancer<span buiEndEnhancer>21</span></bui-button>
      <br /><br />
      <bui-button>End Enhancer<span buiEndEnhancer>ab</span></bui-button>
      <br /><br />
      <bui-button><bui-upload /></bui-button>
    </div>
  `,
})
export class IconButtonsScenario {}
